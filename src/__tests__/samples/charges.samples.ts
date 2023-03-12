import { Business } from "@data/business";
import { ChargeStack } from "@data/charges";
import { CreateChargeStackDto } from "@logic/charges";
import { generateId } from "src/utils";
import { SeedingError } from "../test_utils";
import { businessJson, businessSeeder } from "./business.samples";

const sharedData = {
    businessId: businessJson.id,
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
    await businessSeeder();
    const business = await Business.findOne();
    if (!business) throw new SeedingError("business not found");
    await ChargeStack.create({
        name: "Sample sender stack",
        description: "Just an example",
        businessId: business.id,
        id: generateId(),
        paidBy: "sender",
    });
};
