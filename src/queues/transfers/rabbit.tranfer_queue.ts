import { RabbitTaskQueue } from "@queues/task_queues";
import { TransferMessageDto } from "./message.dto.transfer";
import { TransferQueueInterface } from "./interface.transfer";

export class RabbitTransferQueue
    extends RabbitTaskQueue<TransferMessageDto>
    implements TransferQueueInterface
{
    constructor() {
        super({ name: "transfer_tasks", concurrency: 1 });
    }
}
