import { chargeStackJson } from "src/__tests__/samples";
import {
    ChargesServiceDependencies,
    ChargesServiceInterface,
} from "./interfaces/service.charges.interface";
import { CalculateTransactionChargesDto, ChargeDto } from "./dtos";
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

    calculateTransactionCharges: ChargesServiceInterface["calculateTransactionCharges"] = async (
        data
    ) => {
        const {
            amount,
            businessChargeStack,
            businessChargesPaidBy,
            chargeType,
            customWalletChargeStack,
            platformChargeStack,
            platformChargesPaidBy,
            waiveBusinessCharges,
        } = data;

        let platformCharge = 0;
        let platformGot = amount;
        let businessCharge = 0;
        let businessGot = amount;
        let businessPaid = 0;
        let senderPaid = 0;
        let receiverPaid = 0;
        let settledAmount = amount;

        // calculate business charges
        if (!waiveBusinessCharges) {
            let businessChargeObj = this.getCompatibleCharge(amount, businessChargeStack);
            if (businessChargeObj) {
                const charge = this.calculateCharge(amount, businessChargeObj);

                businessCharge += charge;
                businessGot += charge;

                if (businessChargesPaidBy === "wallet") {
                    if (settledAmount < businessCharge) {
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
            }
        }

        // calculate platform charges
        let platformChargeObj = this.getCompatibleCharge(amount, platformChargeStack);
        if (platformChargeObj) {
            const charge = this.calculateCharge(amount, platformChargeObj);
            platformCharge += charge;
            platformGot += charge;
            if (platformChargesPaidBy === "wallet") {
                if (businessGot < platformCharge)
                    throw new SettlementError({ charge: platformCharge, settlement: businessGot });
                businessGot -= platformCharge;
                businessPaid += platformCharge;
            } else {
                senderPaid += platformCharge;
            }
        }
    };
}
