import {
    CreationOptional,
    ForeignKey,
    InferAttributes,
    InferCreationAttributes,
    Model,
    NonAttribute,
} from "sequelize";
import { WalletModelInterface } from "../../contracts/interfaces";

export class Wallet
    extends Model<InferAttributes<Wallet>, InferCreationAttributes<Wallet>>
    implements WalletModelInterface
{
    declare id: CreationOptional<WalletModelInterface["id"]>;
    declare businessId: ForeignKey<WalletModelInterface["businessId"]>;
    declare business?: NonAttribute<WalletModelInterface["business"]>;
    declare parentWalletId: ForeignKey<WalletModelInterface["id"]>;
    declare parentWallet?: NonAttribute<WalletModelInterface>;
    declare currency: ForeignKey<WalletModelInterface["currency"]>;
    declare balance: WalletModelInterface["balance"];
    declare waiveFundingCharges: WalletModelInterface["waiveFundingCharges"];
    declare waiveWithdrawalCharges: WalletModelInterface["waiveWithdrawalCharges"];
    declare email: WalletModelInterface["email"];
}
