import Joi from "joi";
import {
    CreateChargeSchemeDto,
    allowedChargeSchemePayers,
    allowedChargeSchemeTransactions,
} from "@logic/charge_scheme";

export const CreateChargeSchemeValidator = Joi.object<CreateChargeSchemeDto>({
    name: Joi.string().required(),
    currency: Joi.string().required(),
    description: Joi.string().optional(),
    flatCharge: Joi.number().optional(),
    minimumPrincipalAmount: Joi.number().optional(),
    percentageCharge: Joi.number().optional(),
    percentageChargeCap: Joi.number().optional(),
    transactionType: Joi.string()
        .required()
        .valid(...allowedChargeSchemeTransactions),
    payer: Joi.string()
        .required()
        .valid(...allowedChargeSchemePayers),
});
