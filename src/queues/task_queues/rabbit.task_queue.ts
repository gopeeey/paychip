import * as rabbitImp from "amqplib";
import { Message } from "amqplib";
import config from "src/config";
import { TaskQueueInterface } from "./interface.task_queue";
import { TaskQueueError } from "./error.task_queue";
const rabbit = require("amqplib") as typeof rabbitImp;

const rabbitConfig = config.thirdParty.rabbitMq;

export class RabbitTaskQueue<M> implements TaskQueueInterface<M> {
    name: TaskQueueInterface<M>["name"];
    concurrency: TaskQueueInterface<M>["concurrency"];

    constructor({ name, concurrency }: Pick<TaskQueueInterface<M>, "name" | "concurrency">) {
        this.name = name;
        this.concurrency = concurrency;
    }

    publish: TaskQueueInterface<M>["publish"] = async (message) => {
        try {
            const connection = await rabbit.connect(rabbitConfig.connectionUrl);
            const channel = await connection.createChannel();
            await channel.assertQueue(this.name, { durable: true });
            channel.sendToQueue(this.name, Buffer.from(JSON.stringify(message)), {
                persistent: true,
            });
            setTimeout(async () => {
                await connection.close();
            });
        } catch (err) {
            if (err instanceof Error) throw new TaskQueueError(err.message, this.name, message);
            //@TODO Log this error to what you're monitoring with
        }
    };

    consume: TaskQueueInterface<M>["consume"] = async (callback) => {
        try {
            const connection = await rabbit.connect(rabbitConfig.connectionUrl);
            const channel = await connection.createChannel();
            await channel.prefetch(this.concurrency);
            await channel.assertQueue(this.name, { durable: true });
            await channel.consume(
                this.name,
                async (msg: Message | null) => {
                    if (!msg) return;

                    try {
                        await callback(JSON.parse(msg.content.toString()));
                    } catch (err) {
                        return channel.nack(msg);
                    }

                    channel.ack(msg);
                },
                { noAck: false }
            );
        } catch (err) {
            if (err instanceof Error) throw new TaskQueueError(err.message, this.name);
            //@TODO Log this error to what you're monitoring with
        }
    };
}
