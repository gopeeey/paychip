import Joi from "joi";
import { CreateUserProfileDto } from "../../../logic/dtos";

export const CreateUserValidator = Joi.object<CreateUserProfileDto>({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
});
