import { RabbitTaskQueue } from "@queues/task_queues";
import { VerifyTransferQueueInterface } from "./interface.transfer";

export class RabbitVerifyTransferQueue
    extends RabbitTaskQueue<string>
    implements VerifyTransferQueueInterface
{
    constructor() {
        super({ name: "verify_transfer_task", concurrency: 1 });
    }
}
