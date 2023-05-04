import Joi from "joi";
import { LoginDto } from "@logic/accounts";

export const LoginValidator = Joi.object<LoginDto>({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});
