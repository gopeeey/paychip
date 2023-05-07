import { InternalError } from "@logic/base_errors";
import { FundWalletDto, GetUniqueWalletDto } from "./dtos";
import { InvalidFundingData } from "./errors";
import { WalletModelInterface, WalletServiceInterface } from "./interfaces";

export interface WalletFunderDependencies {
    getWalletById: WalletServiceInterface["getWalletById"];
    getUniqueWallet: WalletServiceInterface["getUniqueWallet"];
}

export class WalletFunder {
    private declare wallet: WalletModelInterface;

    constructor(
        private readonly __dto: FundWalletDto,
        private readonly __deps: WalletFunderDependencies
    ) {}

    async exec() {
        await this.fetchWallet();
        // fetch or create customer
        // calculate charges and amounts
        // create transaction
        // generate payment link
    }

    private async fetchWallet() {
        const { walletId, email, currency, businessId } = this.__dto;
        if (!walletId && (!email || !currency)) {
            throw new InvalidFundingData();
        }

        if (walletId) {
            this.wallet = await this.__deps.getWalletById(walletId);
        } else {
            if (email && currency) {
                const uniqueData = new GetUniqueWalletDto({ businessId, email, currency });
                this.wallet = await this.__deps.getUniqueWallet(uniqueData);
            } else {
                throw new InternalError("Wallet funding data not properly passed", this.__dto);
            }
        }
    }
}
