import { CreateCustomerDto } from "../../contracts/dtos";
import { Customer } from "../../db/models";

export const customerData = new CreateCustomerDto({
    name: "Samuel Customer",
    email: "samcusto@mer.com",
    phone: "+23412345678",
    businessId: 12345678,
});

export const customerObj = new Customer({ ...customerData, id: "something" });
export const customerObjArr = [customerObj];
export const customerJson = customerObj.toJSON();
export const customerJsonArray = [customerJson];
