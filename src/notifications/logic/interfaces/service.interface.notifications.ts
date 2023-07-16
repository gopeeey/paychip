import { SendEmailDto } from "../dtos";

export interface NotificationServiceInterface {
    sendEmail: (data: SendEmailDto) => Promise<void>;
}
