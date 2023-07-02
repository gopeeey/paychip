import { BaseQueueError } from "@queues/base_error.queues";
import { TransactionMessageDto } from "./message.dto.transaction";

export class TransactionQueueError extends BaseQueueError<TransactionMessageDto> {}
