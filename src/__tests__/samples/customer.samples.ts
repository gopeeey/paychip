import { CreateCustomerDto, StandardCustomerDto } from "@logic/customer";
import { Customer } from "@data/customer";
import { businessSeeder } from "./business.samples";
import { Business } from "@data/business";
import { SeedingError } from "../test_utils";
import { generateId } from "src/utils";

export const customerData = {
    complete: new CreateCustomerDto({
        name: "Samuel Customer",
        email: "sammygopeh@gmail.com",
        phone: "+23412345678",
        businessId: 1234,
    }),

    incomplete: new CreateCustomerDto({
        email: "sammygopeh@gmail.com",
        businessId: 1234,
    }),
};

export const customerObj = {
    complete: new Customer({ ...customerData.complete, id: "something" }),
    incomplete: new Customer({ ...customerData.incomplete, id: "something" }),
};

export const customerObjArr = {
    complete: [customerObj.complete],
    incomplete: [customerObj.incomplete],
    mixed: [customerObj.complete, customerObj.incomplete],
};

export const customerJson = {
    complete: customerObj.complete.toJSON(),
    incomplete: customerObj.incomplete.toJSON(),
};

export const customerJsonArray = {
    complete: [customerJson.complete],
    incomplete: [customerJson.incomplete],
    mixed: [customerJson.complete, customerJson.incomplete],
};

export const standardCustomer = {
    complete: new StandardCustomerDto(customerJson.complete),
    incomplete: new StandardCustomerDto(customerJson.incomplete),
};

export const standardCustomerArr = {
    complete: [standardCustomer.complete],
    incomplete: [standardCustomer.incomplete],
    mixed: [standardCustomer.complete, standardCustomer.incomplete],
};

export const customerSeeder = async () => {
    await businessSeeder();
    const business = await Business.findOne();
    if (!business) throw new SeedingError("Business not found");
    await Customer.create({
        id: generateId(),
        ...customerData.complete,
        businessId: business.id,
    });
};
