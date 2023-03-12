import { ChargeStack } from "@data/charges";
import { Wallet } from "@data/index";
import { CreateChargeStackDto } from "@logic/charges";
import { generateId } from "src/utils";
import { SeedingError } from "../test_utils";
import { walletJson, walletSeeder } from "./wallet.samples";

const sharedData = {
    businessId: walletJson.businessId,
    description: "Something here",
    name: "Sample charge stack",
};

export const chargeStackData = {
    sender: new CreateChargeStackDto({ ...sharedData, paidBy: "sender" }),
    receiver: new CreateChargeStackDto({ ...sharedData, paidBy: "receiver" }),
};

export const chargeStackObj = {
    sender: new ChargeStack({ ...chargeStackData.sender, id: "some" }),
    receiver: new ChargeStack({ ...chargeStackData.receiver, id: "some" }),
};

export const chargeStackJson = {
    sender: chargeStackObj.sender.toJSON(),
    receiver: chargeStackObj.receiver.toJSON(),
};

export const chargesSeeder = async () => {
    await walletSeeder();
    const wallet = await Wallet.findOne();
    if (!wallet) throw new SeedingError("wallet not found");
    await ChargeStack.create({
        name: "Sample sender stack",
        description: "Just an example",
        businessId: wallet.businessId,
        id: generateId(),
        paidBy: "sender",
    });
};
