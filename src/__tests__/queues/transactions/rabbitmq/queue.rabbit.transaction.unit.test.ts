import { RabbitTransactionQueue, TransactionMessageDto } from "@queues/transactions";
import { Channel, Connection, Options as AmqpOptions } from "amqplib";
import * as amqpImp from "amqplib/callback_api";
import config from "src/config";
const amqp = require("amqplib/callback_api") as typeof amqpImp;

const rabbitConfig = config.thirdParty.rabbitMq;
const queueName = "transactions";
const queueOptions: AmqpOptions.AssertQueue = { durable: true };
const messageOptions: AmqpOptions.Publish = { persistent: true };

const channelMock: {
    [key in keyof Pick<Channel, "assertExchange" | "assertQueue" | "sendToQueue">]: jest.Mock;
} = {
    assertExchange: jest.fn(),
    assertQueue: jest.fn(),
    sendToQueue: jest.fn(),
};

const connectionMock = {
    createChannel: jest.fn((callback: (err: unknown, channel: typeof channelMock) => void) => {
        callback(null, channelMock);
    }),
    close: jest.fn(),
};

const connectImpl = (
    url: string | AmqpOptions.Connect,
    callback: (err: unknown, conn: Connection) => Promise<void>
) => {
    callback(null, connectionMock as unknown as Connection);
};
const amqpConnectSpy = jest
    .spyOn(amqp, "connect")
    .mockImplementation(connectImpl as unknown as (...args: unknown[]) => any);

const message = new TransactionMessageDto({ provider: "aProvider", reference: "somereference" });

const queue = new RabbitTransactionQueue();

describe("TESTING TRANSACTIONS QUEUE RABBITMQ WRAPPER", () => {
    describe(">>> publish", () => {
        it("should connect to the rabbitmq server", async () => {
            await queue.publish(message);
            expect(amqpConnectSpy).toHaveBeenCalledTimes(1);
            expect(amqpConnectSpy).toHaveBeenCalledWith(
                rabbitConfig.connectionUrl,
                expect.anything()
            );
        });

        it("should create a channel", async () => {
            await queue.publish(message);
            expect(connectionMock.createChannel).toHaveBeenCalledTimes(1);
            expect(connectionMock.createChannel).toHaveBeenCalledWith(expect.anything());
        });

        it("should assert the queue with the correct name", async () => {
            await queue.publish(message);
            expect(channelMock.assertQueue).toHaveBeenCalledTimes(1);
            expect(channelMock.assertQueue).toHaveBeenCalledWith(queueName, queueOptions);
        });

        it("should publish the message passed", async () => {
            await queue.publish(message);
            expect(channelMock.sendToQueue).toHaveBeenCalledTimes(1);
            expect(channelMock.sendToQueue).toHaveBeenCalledWith(
                queueName,
                expect.any(Buffer),
                messageOptions
            );
        });

        it("should close the connection", async () => {
            await queue.publish(message);
            expect(connectionMock.close).toHaveBeenCalledTimes(1);
        });
    });
});
