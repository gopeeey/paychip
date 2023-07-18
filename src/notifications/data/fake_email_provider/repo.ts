import { EmailProviderInterface } from "@notifications/logic";

export class FakeEmailProvider implements EmailProviderInterface {
    sendEmail: EmailProviderInterface["sendEmail"] = async (data) => {
        console.log("\n\n\n\nYOU DEFERRED ACTUALLY SENDING AN EMAIL!! IMPLEMENT IIIIT!!!!", data);
    };
}
