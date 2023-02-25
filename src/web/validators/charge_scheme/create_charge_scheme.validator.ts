import Joi from "joi";
import { CreateChargeSchemeDto } from "../../../contracts/dtos";
import { allowedChargeSchemePayers, allowedTransactionTypes } from "../../../contracts/interfaces";

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
        .valid(...allowedTransactionTypes),
    payer: Joi.string()
        .required()
        .valid(...allowedChargeSchemePayers),
});
