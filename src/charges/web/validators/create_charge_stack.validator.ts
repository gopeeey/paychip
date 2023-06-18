import Joi from "joi";
import { allowedPaidBy, ChargeDto, CreateChargeStackDto } from "@charges/logic";

const charge = Joi.object<ChargeDto>({
    flatCharge: Joi.number(),
    minimumPrincipalAmount: Joi.number(),
    percentageCharge: Joi.number(),
    percentageChargeCap: Joi.number(),
});

export const CreateChargeStackValidator = Joi.object<CreateChargeStackDto>({
    name: Joi.string().required(),
    description: Joi.string().optional(),
    paidBy: Joi.string()
        .valid(...allowedPaidBy)
        .required(),
    charges: Joi.array().items(charge),
});
