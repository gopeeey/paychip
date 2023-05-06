import Joi from "joi";
import { allowedPaidBy, CreateChargeStackDto } from "@logic/charges";

export const CreateChargeStackValidator = Joi.object<CreateChargeStackDto>({
    name: Joi.string().required(),
    description: Joi.string().optional(),
    paidBy: Joi.string()
        .valid(...allowedPaidBy)
        .required(),
    charges: Joi.string().required(),
});
