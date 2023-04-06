import { CreateChargeDto } from "@logic/charges";
import Joi from "joi";

export const CreateChargeValidator = Joi.object<CreateChargeDto>({
    name: Joi.string().required(),
    flatCharge: Joi.number().optional(),
    minimumPrincipalAmount: Joi.number().optional(),
    percentageCharge: Joi.number().optional(),
    percentageChargeCap: Joi.number().optional(),
});
