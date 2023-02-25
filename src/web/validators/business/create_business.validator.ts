import Joi from "joi";
import { CreateBusinessDto } from "@logic/business";

export const CreateBusinessValidator = Joi.object<CreateBusinessDto>({
    name: Joi.string().required().min(1),
    countryCode: Joi.string().required().length(3),
});
