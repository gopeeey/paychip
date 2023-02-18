import { CreateCustomerDto, CreateWalletDto } from "../../../../dtos";
import { CustomerModelInterface, WalletModelInterface, WalletRepoInterface } from "../../../db";

export interface WalletCreatorInterface {
    create: () => Promise<WalletModelInterface>;
}

export interface WalletCreatorDependencies {
    dto: CreateWalletDto;
    repo: WalletRepoInterface;
    // createCustomer: (createCustomerDto: CreateCustomerDto) => Promise<CustomerModelInterface>;
}
