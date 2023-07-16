import { NotificationServiceDependencies, NotificationServiceInterface } from "./interfaces";

export class NotificationService implements NotificationServiceInterface {
    constructor(private readonly _deps: NotificationServiceDependencies) {}

    sendEmail: NotificationServiceInterface["sendEmail"] = async (data) => {
        await this._deps.emailProvider.sendEmail(data);
    };
}
