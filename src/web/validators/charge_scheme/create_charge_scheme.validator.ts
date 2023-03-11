import Joi from "joi";
import {
    CreateChargeStackDto,
    allowedChargeStackPayers,
    allowedChargeStackTransactions,
} from "@logic/charges";

export const CreateChargeStackValidator = Joi.object<CreateChargeStackDto>({
    name: Joi.string().required(),
    currency: Joi.string().required(),
    description: Joi.string().optional(),
    flatCharge: Joi.number().optional(),
    minimumPrincipalAmount: Joi.number().optional(),
    percentageCharge: Joi.number().optional(),
    percentageChargeCap: Joi.number().optional(),
    transactionType: Joi.string()
        .required()
        .valid(...allowedChargeStackTransactions),
    payer: Joi.string()
        .required()
        .valid(...allowedChargeStackPayers),
});
