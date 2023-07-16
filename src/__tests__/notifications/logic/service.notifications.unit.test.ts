import {
    EmailProviderInterface,
    NotificationService,
    NotificationServiceDependencies,
    SendEmailDto,
} from "@notifications/logic";

const emailProviderMock: { [key in keyof Pick<EmailProviderInterface, "sendEmail">]: jest.Mock } = {
    sendEmail: jest.fn(),
};

const deps: NotificationServiceDependencies = {
    emailProvider: emailProviderMock,
};

const service = new NotificationService(deps);

describe("TESTING NOTIFICATION SERVICE", () => {
    describe(">>> sendEmail", () => {
        it("should call the emailProvider with the given data", async () => {
            const data = new SendEmailDto({
                to: "example@email.com",
                template: "wallet_credit",
                data: { amount: 1000, name: "Example" },
            });

            await service.sendEmail(data);
            expect(emailProviderMock.sendEmail).toHaveBeenCalledTimes(1);
            expect(emailProviderMock.sendEmail).toHaveBeenCalledWith(data);
        });
    });
});
