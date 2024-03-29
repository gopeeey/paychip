import Joi from "joi";
import { CreateAccountDto } from "@accounts/logic";

export const CreateAccountValidator = Joi.object<CreateAccountDto>({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
});
