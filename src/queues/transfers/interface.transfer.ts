import { TaskQueueInterface } from "@queues/task_queues";
import { TransferMessageDto } from "./message.dto.transfer";
import { VerifyTransferDto } from "@payment_providers/logic";

export interface TransferQueueInterface extends TaskQueueInterface<TransferMessageDto> {}
export interface VerifyTransferQueueInterface extends TaskQueueInterface<VerifyTransferDto> {}
