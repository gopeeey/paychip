import { SendEmailDto } from "../dtos";

export interface EmailProviderInterface {
    sendEmail: (data: SendEmailDto) => Promise<void>;
}
