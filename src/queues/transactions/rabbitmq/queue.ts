import { TransactionQueueInterface } from "../interface.transaction";
import { TransactionMessageDto } from "../message.dto.transaction";
import { RabbitTaskQueue } from "@queues/task_queues";

export class RabbitTransactionQueue
    extends RabbitTaskQueue<TransactionMessageDto>
    implements TransactionQueueInterface
{
    constructor() {
        super({ name: "transaction_tasks", concurrency: 1 });
    }
}
