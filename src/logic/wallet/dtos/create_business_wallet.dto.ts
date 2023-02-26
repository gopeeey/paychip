import { CreateWalletDto } from "./create_wallet.dto";

interface RequiredProps extends CreateWalletDto {
    parentWalletId: string;
}

export class CreateBusinessWalletDto extends CreateWalletDto implements RequiredProps {
    parentWalletId: string;

    constructor(body: RequiredProps) {
        super(body);
        this.parentWalletId = body.parentWalletId;
    }
}
