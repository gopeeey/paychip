import { BaseQueueInterface } from "@queues/base_queue_interface";
import { TransactionMessageDto } from "./message.dto.transaction";

export interface TransactionQueueInterface extends BaseQueueInterface<TransactionMessageDto> {}
