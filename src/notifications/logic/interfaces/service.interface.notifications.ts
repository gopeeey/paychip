import { SendEmailDto } from "../dtos";
import { EmailProviderInterface } from "./email_provider.interface";

export interface NotificationServiceInterface {
    sendEmail: (data: SendEmailDto) => Promise<void>;
}

export interface NotificationServiceDependencies {
    emailProvider: EmailProviderInterface;
}
