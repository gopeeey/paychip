import { TransactionQueueInterface } from "../interface.transaction";
import * as amqpImp from "amqplib/callback_api";
import config from "src/config";
import { TransactionQueueError } from "../error.transaction.queue";
const amqp = require("amqplib/callback_api") as typeof amqpImp;

const rabbitConfig = config.thirdParty.rabbitMq;

export class RabbitTransactionQueue implements TransactionQueueInterface {
    name: string = "transactions";

    publish: TransactionQueueInterface["publish"] = (message) => {
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
                        connection.close();
                        resolve();
                    });
                });
            } catch (err) {
                if (err instanceof Error)
                    return reject(new TransactionQueueError(err.message, message));
                reject(err);
            }
        });
    };

    consume: TransactionQueueInterface["consume"] = (callback) => {};
}
