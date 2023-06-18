import Joi from "joi";
import { LoginDto } from "@accounts/logic";

export const LoginValidator = Joi.object<LoginDto>({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});
