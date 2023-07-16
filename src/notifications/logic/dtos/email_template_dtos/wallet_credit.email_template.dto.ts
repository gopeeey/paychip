type Props = { amount: number; name: string };

export class WalletCreditEmailTemplateDto {
    amount: Props["amount"];
    name: Props["name"];

    constructor(body: Props) {
        this.amount = body.amount;
        this.name = body.name;
    }
}
