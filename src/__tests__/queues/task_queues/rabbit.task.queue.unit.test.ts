import { TransactionMessageDto } from "@queues/transactions";
import { RabbitTaskQueue } from "@queues/task_queues";
import { Channel, Connection, Message, Options as AmqpOptions } from "amqplib";
import amqp from "amqplib";
import config from "src/config";

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
    createChannel: jest.fn(async () => channelMock),
    close: jest.fn(async () => null),
};

const amqpConnectSpy = jest
    .spyOn(amqp, "connect")
    .mockImplementation(async () => connectionMock as unknown as Connection);

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
            expect(amqpConnectSpy).toHaveBeenCalledWith(rabbitConfig.connectionUrl);
        });

        it("should create a channel", async () => {
            await queue.publish(message);
            expect(connectionMock.createChannel).toHaveBeenCalledTimes(1);
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
        it("should connect to the rabbitmq server", async () => {
            queue.consume(consumeCallbackMock);
            expect(amqpConnectSpy).toHaveBeenCalledTimes(1);
            expect(amqpConnectSpy).toHaveBeenCalledWith(rabbitConfig.connectionUrl);
        });

        it("should create a channel", async () => {
            await queue.consume(consumeCallbackMock);
            expect(connectionMock.createChannel).toHaveBeenCalledTimes(1);
        });

        it("should set the proper prefetch value", async () => {
            await queue.consume(consumeCallbackMock);
            expect(channelMock.prefetch).toHaveBeenCalledTimes(1);
            expect(channelMock.prefetch).toHaveBeenCalledWith(concurrency);
        });

        it("should assert the queue with the correct name", async () => {
            await queue.consume(consumeCallbackMock);
            expect(channelMock.assertQueue).toHaveBeenCalledTimes(1);
            expect(channelMock.assertQueue).toHaveBeenCalledWith(queueName, queueOptions);
        });

        it("should call the consume method on the channel", async () => {
            await queue.consume(consumeCallbackMock);
            expect(channelMock.consume).toHaveBeenCalledTimes(1);
            expect(channelMock.consume).toHaveBeenCalledWith(
                queueName,
                expect.anything(),
                consumeOptions
            );
        });

        it("should call the consume callback with the message and acknowledge it", async () => {
            await queue.consume(consumeCallbackMock);
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
                await queue.consume(consumeCallbackMock);
                expect(channelMock.nack).toHaveBeenCalledTimes(1);
                expect(channelMock.nack).toHaveBeenCalledWith(queueMsgMock);
            });
        });
    });
});
