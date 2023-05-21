import { chargeStackJson } from "src/__tests__/samples";
import {
    ChargesServiceDependencies,
    ChargesServiceInterface,
} from "./interfaces/service.charges.interface";
import { CalculateTransactionChargesDto, ChargeDto, ChargesCalculationResultDto } from "./dtos";
import { SettlementError } from "./errors";

export class ChargesService implements ChargesServiceInterface {
    private readonly _repo: ChargesServiceDependencies["repo"];

    constructor(private readonly _deps: ChargesServiceDependencies) {
        this._repo = this._deps.repo;
    }

    createStack: ChargesServiceInterface["createStack"] = async (createStackDto, session) => {
        const chargeStack = await this._repo.createChargeStack(createStackDto, session);
        return chargeStack;
    };

    addStackToWallet: ChargesServiceInterface["addStackToWallet"] = async (addStackToWalletDto) => {
        await this._repo.addStackToWallet(addStackToWalletDto);
    };

    getCompatibleCharge: ChargesServiceInterface["getCompatibleCharge"] = (amount, charges) => {
        let charge: ChargeDto | null = null;
        for (const currentCharge of charges) {
            if (currentCharge.minimumPrincipalAmount > amount) continue;
            if (!charge) {
                charge = currentCharge;
                continue;
            }

            const currentDiff = amount - currentCharge.minimumPrincipalAmount;
            const prevDiff = amount - charge.minimumPrincipalAmount;

            if (currentDiff < prevDiff) charge = currentCharge;
        }

        return charge;
    };

    calculateCharge: ChargesServiceInterface["calculateCharge"] = (amount, charge) => {
        let totalCharge = 0;
        if (charge.flatCharge) totalCharge += charge.flatCharge;
        let percentageChargeAmount = 0;
        if (charge.percentageCharge)
            percentageChargeAmount = amount * (charge.percentageCharge / 100);
        if (charge.percentageChargeCap && percentageChargeAmount > charge.percentageChargeCap) {
            percentageChargeAmount = charge.percentageChargeCap;
        }

        totalCharge += percentageChargeAmount;

        return totalCharge;
    };

    calculateTransactionCharges: ChargesServiceInterface["calculateTransactionCharges"] = (
        data
    ) => {
        const {
            amount,
            businessChargeStack,
            businessChargesPaidBy,
            transactionType,
            customWalletChargeStack,
            platformChargeStack,
            platformChargesPaidBy,
            waiveBusinessCharges,
        } = data;

        const isCredit = transactionType === "credit";

        let platformCharge = 0;
        let platformGot = isCredit ? amount : 0;
        let businessCharge = 0;
        let businessGot = isCredit ? amount : 0;
        let businessPaid = isCredit ? 0 : amount;
        let senderPaid = isCredit ? 0 : amount;
        let receiverPaid = 0;
        let settledAmount = amount;

        // calculate business charges
        if (!waiveBusinessCharges) {
            let businessChargeObj = this.getCompatibleCharge(
                amount,
                customWalletChargeStack || businessChargeStack
            );
            if (businessChargeObj) {
                const charge = this.calculateCharge(amount, businessChargeObj);

                businessCharge += charge;
                if (isCredit) businessGot += charge;

                if (businessChargesPaidBy === "wallet") {
                    if (isCredit) {
                        if (settledAmount <= businessCharge) {
                            throw new SettlementError({
                                charge: businessCharge,
                                settlement: settledAmount,
                            });
                        }

                        settledAmount -= businessCharge;
                        receiverPaid += businessCharge;
                    } else {
                        senderPaid += businessCharge;
                    }
                } else {
                    if (isCredit) {
                        senderPaid += businessCharge;
                    } else {
                        if (settledAmount <= businessCharge) {
                            throw new SettlementError({
                                charge: businessCharge,
                                settlement: settledAmount,
                            });
                        }
                        settledAmount -= businessCharge;
                        receiverPaid += businessCharge;
                    }
                }
            }
        }

        // calculate platform charges
        let platformChargeObj = this.getCompatibleCharge(amount, platformChargeStack);
        if (platformChargeObj) {
            const charge = this.calculateCharge(amount, platformChargeObj);

            platformCharge += charge;
            if (isCredit) platformGot += charge;

            if (platformChargesPaidBy === "wallet") {
                if (isCredit) {
                    if (businessGot < platformCharge) {
                        throw new SettlementError({
                            charge: platformCharge,
                            settlement: businessGot,
                        });
                    }
                    businessGot -= platformCharge;
                    businessPaid += platformCharge;
                } else {
                    businessPaid += platformCharge;
                }
            } else {
                if (isCredit) {
                    senderPaid += platformCharge;
                } else {
                    if (settledAmount <= platformCharge) {
                        throw new SettlementError({
                            charge: platformCharge,
                            settlement: settledAmount,
                        });
                    }

                    settledAmount -= platformCharge;
                    receiverPaid += platformCharge;
                }
            }
        }

        return new ChargesCalculationResultDto({
            platformCharge,
            platformGot,
            businessCharge,
            businessGot,
            businessPaid,
            senderPaid,
            receiverPaid,
            settledAmount,
        });
    };
}
