import { TaskQueueInterface } from "@queues/task_queues";
import { TransferMessageDto } from "./message.dto.transfer";

export interface TransferQueueInterface extends TaskQueueInterface<TransferMessageDto> {}
export interface VerifyTransferQueueInterface extends TaskQueueInterface<string> {}
