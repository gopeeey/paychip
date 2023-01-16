import Joi from "joi";
import { LoginDto } from "../../../logic/dtos";

export const LoginValidator = Joi.object<LoginDto>({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
});
