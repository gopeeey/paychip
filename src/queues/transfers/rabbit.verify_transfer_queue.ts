import { RabbitTaskQueue } from "@queues/task_queues";
import { VerifyTransferQueueInterface } from "./interface.transfer";
import { VerifyTransferDto } from "@payment_providers/logic";

export class RabbitVerifyTransferQueue
    extends RabbitTaskQueue<VerifyTransferDto>
    implements VerifyTransferQueueInterface
{
    constructor() {
        super({ name: "verify_transfer_task", concurrency: 1 });
    }
}
