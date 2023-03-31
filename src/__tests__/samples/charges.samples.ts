import { ChargeStack, Charge } from "@data/charges";
import { Wallet } from "@data/index";
import {
    CreateChargeDto,
    CreateChargeStackDto,
    StandardChargeDto,
    StandardChargeStackDto,
} from "@logic/charges";
import { generateId } from "src/utils";
import { SeedingError } from "../test_utils";
import { walletJson, walletSeeder } from "./wallet.samples";

const sharedData = {
    businessId: walletJson.businessId,
    description: "Something here",
    name: "Sample charge stack",
};

export const chargeStackData = {
    wallet: new CreateChargeStackDto({ ...sharedData, paidBy: "wallet" }),
    customer: new CreateChargeStackDto({ ...sharedData, paidBy: "customer" }),
    noPaidBy: new CreateChargeStackDto({ ...sharedData }),
};

export const chargeStackObj = {
    wallet: new ChargeStack({ ...chargeStackData.wallet, id: "some" }),
    customer: new ChargeStack({ ...chargeStackData.customer, id: "some" }),
    noPaidBy: new ChargeStack({ ...chargeStackData.noPaidBy, id: "some" }),
};

export const chargeStackJson = {
    wallet: chargeStackObj.wallet.toJSON(),
    customer: chargeStackObj.customer.toJSON(),
    noPaidBy: chargeStackObj.noPaidBy.toJSON(),
};

export const standardChargeStack = {
    wallet: new StandardChargeStackDto(chargeStackJson.wallet),
    customer: new StandardChargeStackDto(chargeStackJson.customer),
    noPaidBy: new StandardChargeStackDto(chargeStackJson.noPaidBy),
};

export const chargeData = new CreateChargeDto({
    businessId: 1234,
    flatCharge: 4000,
    minimumPrincipalAmount: 120000,
    name: "For something",
    percentageCharge: 34.5,
    percentageChargeCap: 4000,
});

export const chargeObj = new Charge({ ...chargeData, id: "charge_id" });
export const chargeJson = chargeObj.toJSON();
export const standardCharge = new StandardChargeDto(chargeJson);

export const chargesSeeder = async () => {
    await walletSeeder();
    const wallet = await Wallet.findOne();
    if (!wallet) throw new SeedingError("wallet not found");
    await ChargeStack.create({
        name: "Sample sender stack",
        description: "Just an example",
        businessId: wallet.businessId,
        id: generateId(wallet.businessId),
        paidBy: "wallet",
    });

    await Charge.create({
        businessId: wallet.businessId,
        flatCharge: 2000,
        id: generateId(wallet.businessId),
        minimumPrincipalAmount: 30,
        name: "Tester",
        percentageCharge: 30,
        percentageChargeCap: 40000,
    });
};
