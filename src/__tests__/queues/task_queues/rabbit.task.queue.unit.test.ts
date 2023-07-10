import { TransactionMessageDto } from "@queues/transactions";
import { RabbitTaskQueue } from "@queues/task_queues";
import { Channel, Connection, Message, Options as AmqpOptions } from "amqplib";
import * as amqpImp from "amqplib/callback_api";
import config from "src/config";
const amqp = require("amqplib/callback_api") as typeof amqpImp;

const rabbitConfig = config.thirdParty.rabbitMq;
const queueName = "transactions";
const queueOptions: AmqpOptions.AssertQueue = { durable: true };
const messageOptions: AmqpOptions.Publish = { persistent: true };
const consumeOptions: AmqpOptions.Consume = { noAck: false };

const message = new TransactionMessageDto({ provider: "aProvider", reference: "somereference" });
const queueMsgMock = { content: Buffer.from(JSON.stringify(message)) };

const channelMock: {
    [key in keyof Pick<
        Channel,
        "assertExchange" | "assertQueue" | "sendToQueue" | "prefetch" | "consume" | "ack" | "nack"
    >]: jest.Mock;
} = {
    assertExchange: jest.fn(),
    assertQueue: jest.fn(),
    sendToQueue: jest.fn(),
    prefetch: jest.fn(),
    consume: jest.fn(
        (
            name: string,
            callback: (msg: typeof queueMsgMock) => Promise<void>,
            options: AmqpOptions.Consume
        ) => {
            callback(queueMsgMock);
        }
    ),
    ack: jest.fn(),
    nack: jest.fn(),
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

const concurrency = 1;
const queue = new RabbitTaskQueue({ name: queueName, concurrency });

const consumeCallbackMock = jest.fn(async (message: unknown) => {
    console.log(message);
});

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
            jest.useFakeTimers();
            await queue.publish(message);

            jest.runAllTimers();
            expect(connectionMock.close).toHaveBeenCalledTimes(1);
            jest.useRealTimers();
        });
    });

    describe(">>> consume", () => {
        it("should connect to the rabbitmq server", () => {
            queue.consume(consumeCallbackMock);
            expect(amqpConnectSpy).toHaveBeenCalledTimes(1);
            expect(amqpConnectSpy).toHaveBeenCalledWith(
                rabbitConfig.connectionUrl,
                expect.anything()
            );
        });

        it("should create a channel", () => {
            queue.consume(consumeCallbackMock);
            expect(connectionMock.createChannel).toHaveBeenCalledTimes(1);
            expect(connectionMock.createChannel).toHaveBeenCalledWith(expect.anything());
        });

        it("should set the proper prefetch value", () => {
            queue.consume(consumeCallbackMock);
            expect(channelMock.prefetch).toHaveBeenCalledTimes(1);
            expect(channelMock.prefetch).toHaveBeenCalledWith(concurrency);
        });

        it("should assert the queue with the correct name", () => {
            queue.consume(consumeCallbackMock);
            expect(channelMock.assertQueue).toHaveBeenCalledTimes(1);
            expect(channelMock.assertQueue).toHaveBeenCalledWith(queueName, queueOptions);
        });

        it("should call the consume method on the channel", () => {
            queue.consume(consumeCallbackMock);
            expect(channelMock.consume).toHaveBeenCalledTimes(1);
            expect(channelMock.consume).toHaveBeenCalledWith(
                queueName,
                expect.anything(),
                consumeOptions
            );
        });

        it("should call the consume callback with the message and acknowledge it", () => {
            queue.consume(consumeCallbackMock);
            expect(consumeCallbackMock).toHaveBeenCalledTimes(1);
            expect(consumeCallbackMock).toHaveBeenCalledWith(
                JSON.parse(queueMsgMock.content.toString())
            );
            expect(channelMock.ack).toHaveBeenCalledTimes(1);
            expect(channelMock.ack).toHaveBeenCalledWith(queueMsgMock);
        });

        describe("given the callback throws an error", () => {
            it("should negatively acknowledge the message", async () => {
                consumeCallbackMock.mockRejectedValue(new Error("Hi"));
                queue.consume(consumeCallbackMock);
                expect(channelMock.nack).toHaveBeenCalledTimes(1);
                expect(channelMock.nack).toHaveBeenCalledWith(queueMsgMock);
            });
        });
    });
});
