import { AddChargesToStackDto } from "@logic/charges";
import Joi from "joi";

export const AddChargesToStackValidator = Joi.object<AddChargesToStackDto>({
    stackId: Joi.string().required(),
    chargeIds: Joi.array().items(Joi.string().required()).required(),
});
