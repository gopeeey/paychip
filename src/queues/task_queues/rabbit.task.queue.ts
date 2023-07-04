import * as amqpImp from "amqplib/callback_api";
import { Message } from "amqplib";
import config from "src/config";
const amqp = require("amqplib/callback_api") as typeof amqpImp;
import { TaskQueueInterface } from "./interface.task.queue";
import { TaskQueueError } from "./error.task.queue";

const rabbitConfig = config.thirdParty.rabbitMq;

export class RabbitTaskQueue<M> implements TaskQueueInterface<M> {
    name: TaskQueueInterface<M>["name"];
    concurrency: TaskQueueInterface<M>["concurrency"];

    constructor({ name, concurrency }: Pick<TaskQueueInterface<M>, "name" | "concurrency">) {
        this.name = name;
        this.concurrency = concurrency;
    }

    publish: TaskQueueInterface<M>["publish"] = async (message) => {
        return new Promise((resolve, reject) => {
            try {
                amqp.connect(rabbitConfig.connectionUrl, (err1, connection) => {
                    if (err1) throw err1;

                    connection.createChannel((err2, channel) => {
                        if (err2) throw err2;

                        channel.assertQueue(this.name, { durable: true });
                        channel.sendToQueue(this.name, Buffer.from(JSON.stringify(message)), {
                            persistent: true,
                        });

                        setTimeout(() => {
                            connection.close();
                        });
                        // connection.close();
                        resolve();
                    });
                });
            } catch (err) {
                if (err instanceof Error) return reject(new TaskQueueError(err.message, message));
                reject(err);
            }
        });
    };

    consume: TaskQueueInterface<M>["consume"] = async (callback) => {
        try {
            amqp.connect(rabbitConfig.connectionUrl, (err1, connection) => {
                if (err1) throw err1;

                connection.createChannel((err2, channel) => {
                    if (err2) throw err2;

                    channel.prefetch(this.concurrency);
                    channel.assertQueue(this.name, { durable: true });
                    channel.consume(
                        this.name,
                        async (msg: Message | null) => {
                            if (!msg) return;

                            await callback(JSON.parse(msg.content.toString()));

                            channel.ack(msg);
                        },
                        { noAck: false }
                    );
                });
            });
        } catch (err) {
            if (err instanceof Error) throw new TaskQueueError(err.message);
            throw err;
        }
    };
}
