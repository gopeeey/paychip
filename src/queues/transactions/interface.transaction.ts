import { TransactionMessageDto } from "./message.dto.transaction";
import { TaskQueueInterface } from "@queues/task_queues";

export interface TransactionQueueInterface extends TaskQueueInterface<TransactionMessageDto> {}
