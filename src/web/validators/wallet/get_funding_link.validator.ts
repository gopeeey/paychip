import { InitializeFundingDto } from "@logic/wallet";
import Joi from "joi";

export const GetFundingLinkValidator = Joi.object<InitializeFundingDto>({
    amount: Joi.number().min(1).required(),
    callbackUrl: Joi.string().optional(),
    currency: Joi.string().when("walletId", {
        not: Joi.exist(),
        then: Joi.string().required(),
        otherwise: Joi.string().optional(),
    }),
    email: Joi.string().when("walletId", {
        not: Joi.exist(),
        then: Joi.string().required(),
        otherwise: Joi.string().optional(),
    }),
    walletId: Joi.string().optional(),
});
