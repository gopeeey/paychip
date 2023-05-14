import { chargeStackJson } from "src/__tests__/samples";
import {
    ChargesServiceDependencies,
    ChargesServiceInterface,
} from "./interfaces/service.charges.interface";
import { CalculateTransactionChargesDto, ChargeDto } from "./dtos";

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

    calculateChargeAmounts: ChargesServiceInterface["calculateChargeAmounts"] = (
        amount,
        charge
    ) => {
        let totalCharge = 0;
        if (charge.flatCharge) totalCharge += charge.flatCharge;
        let percentageChargeAmount = 0;
        if (charge.percentageCharge)
            percentageChargeAmount = amount * (charge.percentageCharge / 100);
        if (charge.percentageChargeCap && percentageChargeAmount > charge.percentageChargeCap) {
            percentageChargeAmount = charge.percentageChargeCap;
        }

        totalCharge += percentageChargeAmount;

        return { charge: totalCharge, got: amount + totalCharge };
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
        let platformGot = 0;
        let businessCharge = 0;
        let businessGot = 0;

        // calculate platform charges
        let platformChargeObj = this.getCompatibleCharge(amount, platformChargeStack);
        if (platformChargeObj) {
            const { charge, got } = this.calculateChargeAmounts(amount, platformChargeObj);
            platformCharge = charge;
            platformGot = got;
        }

        // calculate business charges
        let businessChargeObj = this.getCompatibleCharge(amount, businessChargeStack);
        if (businessChargeObj) {
            const { charge, got } = this.calculateChargeAmounts(amount, businessChargeObj);
            businessCharge = charge;
            businessGot = got;
        }
    };
}
