import { BaseQueueInterface } from "@queues/base_queue_interface";

export interface TaskQueueInterface<M> extends BaseQueueInterface<M> {
    concurrency: number;
}
