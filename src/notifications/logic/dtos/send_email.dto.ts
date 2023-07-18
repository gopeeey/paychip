import {
    BusinessWalletCreditEmailTemplateDto,
    BusinessWalletDebitEmailTemplateDto,
    WalletCreditEmailTemplateDto,
    WalletDebitEmailTemplateDto,
} from "./email_template_dtos";

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

interface BusinessWalletCreditProps extends BaseProps {
    template: "business_wallet_credit";
    data: BusinessWalletCreditEmailTemplateDto;
}

interface BusinessWalletDebitProps extends BaseProps {
    template: "business_wallet_debit";
    data: BusinessWalletDebitEmailTemplateDto;
}

type Props =
    | WalletCreditProps
    | WalletDebitProps
    | BusinessWalletCreditProps
    | BusinessWalletDebitProps;

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
