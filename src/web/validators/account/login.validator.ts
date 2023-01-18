import Joi from "joi";
import { LoginDto } from "../../../contracts/dtos";

export const LoginValidator = Joi.object<LoginDto>({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});
