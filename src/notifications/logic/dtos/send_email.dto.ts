import { WalletCreditEmailTemplateDto, WalletDebitEmailTemplateDto } from "./email_template_dtos";

interface BaseProps {
    to: string;
}

interface WalletCreditProps extends BaseProps {
    template: "wallet_credit";
    data: WalletCreditEmailTemplateDto;
}

interface WalletDebitProps extends BaseProps {
    template: "wallet_debit";
    data: WalletDebitEmailTemplateDto;
}

type Props = WalletCreditProps | WalletDebitProps;

export class SendEmailDto {
    to: Props["to"];
    template: Props["template"];
    data: Props["data"];

    constructor(body: Props) {
        this.to = body.to;
        this.template = body.template;
        this.data = body.data;
    }
}
