import { CreateWalletDto } from "../dtos";
import { WalletModelInterface } from "./wallet.model.interface";
import { WalletRepoInterface } from "./wallet.repo.interface";

export interface WalletCreatorInterface {
    create: () => Promise<WalletModelInterface>;
}

export interface WalletCreatorDependencies {
    dto: CreateWalletDto;
    repo: WalletRepoInterface;
    // createCustomer: (createCustomerDto: CreateCustomerDto) => Promise<CustomerModelInterface>;
}
