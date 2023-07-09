import { VerifyTransactionResponseDto } from "@third_party/payment_providers/logic";
import {
    TransactionResolverDependencies,
    TransactionResolverInterface,
    WalletModelInterface,
} from "./interfaces";
import { TransactionResolutionError } from "./errors";
import {
    CreateTransactionDto,
    TransactionModelInterface,
    UpdateTransactionInfoDto,
} from "@transaction/logic";
import { CustomerModelInterface, GetSingleBusinessCustomerDto } from "@customer/logic";
import { SessionInterface } from "@bases/logic";
import { IncrementBalanceDto } from "./dtos";

export class TransactionResolver implements TransactionResolverInterface {
    reference: string;
    provider: string;
    declare transactionData: VerifyTransactionResponseDto;
    declare transaction: TransactionModelInterface;
    declare customer?: CustomerModelInterface;
    declare wallet: WalletModelInterface;
    session: SessionInterface | undefined;

    constructor(private readonly _deps: TransactionResolverDependencies) {
        this.reference = _deps.reference;
        this.provider = _deps.provider;
    }

    exec = async () => {
        try {
            await this.startSession();

            await this.verifyTransaction();
            await this.getWallet();
            await this.getOrCreateTransaction();
            await this.createChargesTransaction();
            await this.updateTransactionInfo();
            await this.incrementBalance();
            await this.incrementBusinessWalletBalance();

            await this.commitSessionChanges();
            await this.endSession();

            //@TODO send credit notifications (email) to the wallet and business wallet email
        } catch (err) {
            await this.endSession();
            throw err;
        }
    };

    startSession = async () => {
        this.session = await this._deps.startSession();
    };

    commitSessionChanges = async () => {
        if (this.session && !this.session.ended) await this.session.commit();
    };

    endSession = async () => {
        if (this.session && !this.session.ended) await this.session.end();
    };

    verifyTransaction = async () => {
        const trxData = await this._deps.verifyTransactionFromProvider(
            this.reference,
            this.provider
        );
        if (!trxData) {
            throw new TransactionResolutionError(`Transaction not found from provider`, {
                reference: this.reference,
                provider: this.provider,
            });
        }
        this.transactionData = trxData;
    };

    getWallet = async () => {
        this.wallet = await this._deps.getWalletById(this.transactionData.walletId);
    };

    getOrCreateTransaction = async () => {
        let transaction = await this._deps.findTransactionByRefAndStatus(this.reference, "pending");
        if (!transaction) transaction = await this.createTransaction();
        if (!transaction)
            throw new TransactionResolutionError(
                "Unable to get or create transaction",
                this.transactionData
            );
        this.transaction = transaction;
    };

    createTransaction = async () => {
        // Fetch business wallet
        const businessWallet = await this._deps.getBusinessWallet(
            this.wallet.businessId,
            this.wallet.currency
        );
        // Fetch the currency
        const currency = await this._deps.getCurrency(this.wallet.currency);
        // Fetch wallet charge stack
        const chargeStack = await this._deps.getWalletChargeStack(this.wallet.id, "funding");
        // Fetch customer
        const customer = await this._deps.getOrCreateCustomer(
            new GetSingleBusinessCustomerDto({
                businessId: this.wallet.businessId,
                email: this.wallet.email,
            })
        );
        this.customer = customer;
        //@TODO Optimize the above by making fetching businessWallet,
        // currency, chargeStack, maybe customer and wallet from just one trip
        // to the database (for wallet funding, or essentials for wallet funding)

        const {
            businessCharge,
            businessGot,
            businessPaid,
            platformCharge,
            platformGot,
            receiverPaid,
            senderPaid,
            settledAmount,
            businessChargesPaidBy,
            platformChargesPaidBy,
        } = this._deps.calculateCharges({
            amount: this.transactionData.amount,
            // businessChargesPaidBy:
            //     chargeStack?.paidBy || businessWallet.w_fundingChargesPaidBy,
            businessChargesPaidBy: "wallet",
            businessChargeStack: businessWallet.w_fundingCs || [],
            customWalletChargeStack: chargeStack?.charges || null,
            // platformChargesPaidBy: businessWallet.fundingChargesPaidBy,
            platformChargesPaidBy: "wallet",
            platformChargeStack: businessWallet.customFundingCs || currency?.fundingCs || [],
            transactionType: "credit",
            waiveBusinessCharges: this.wallet.waiveFundingCharges,
        });

        const transactionData = new CreateTransactionDto({
            amount: this.transactionData.amount,
            businessCharge,
            businessChargePaidBy: businessChargesPaidBy,
            platformChargePaidBy: platformChargesPaidBy,
            businessGot,
            businessId: this.wallet.businessId,
            businessPaid,
            bwId: businessWallet.id,
            channel: this.transactionData.channel,
            currency: this.wallet.currency,
            platformCharge,
            platformGot,
            receiverPaid,
            senderPaid,
            settledAmount,
            transactionType: "credit",
            customerId: customer.id,
            reference: this.transactionData.reference,
            provider: this.provider,
            senderWalletId: this.wallet.id,
            receiverWalletId: this.wallet.id,
        });

        const transaction = await this._deps.createTransaction(transactionData, this.session);
        return transaction;
    };

    createChargesTransaction = async () => {
        if (!this.transaction.businessCharge || !this.customer) return;
        const transactionData = new CreateTransactionDto({
            amount: this.transaction.businessCharge,
            businessCharge: 0,
            businessChargePaidBy: "wallet",
            platformChargePaidBy: "wallet",
            businessGot: this.transaction.businessCharge,
            businessId: this.wallet.businessId,
            businessPaid: 0,
            bwId: this.wallet.businessWalletId,
            channel: this.transactionData.channel,
            currency: this.wallet.currency,
            platformCharge: 0,
            platformGot: 0,
            receiverPaid: 0,
            senderPaid: this.transaction.businessCharge,
            settledAmount: this.transaction.businessCharge,
            transactionType: "debit",
            customerId: this.customer.id,
            reference: this.transactionData.reference,
            provider: this.provider,
            senderWalletId: this.wallet.id,
        });

        await this._deps.createTransaction(transactionData, this.session);
    };

    updateTransactionInfo = async () => {
        await this._deps.updateTransactionInfo(
            this.transaction.id,
            new UpdateTransactionInfoDto({ ...this.transactionData }),
            this.session
        );
    };

    incrementBalance = async () => {
        const data = new IncrementBalanceDto({
            walletId: this.wallet.id,
            amount: this.transaction.settledAmount,
            session: this.session,
        });
        await this._deps.incrementWalletBalance(data);
    };

    incrementBusinessWalletBalance = async () => {
        if (!this.wallet.businessWalletId || !this.transaction.businessGot) return;
        const data = new IncrementBalanceDto({
            walletId: this.wallet.businessWalletId,
            amount: this.transaction.businessGot,
            session: this.session,
        });
        await this._deps.incrementWalletBalance(data);
    };
}
