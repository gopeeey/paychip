import { BaseQueueError } from "@queues/base_error.queues";

export class TaskQueueError extends BaseQueueError<unknown> {
    constructor(message: string, taskData?: unknown) {
        super(message, taskData);
        this.name = "Task Queue Error";
    }
}
