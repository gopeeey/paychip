import { AddChargeStackToWalletDto, allowedChargeTypes } from "@logic/charges";
import Joi from "joi";

export const AddStackToWalletValidator = Joi.object<AddChargeStackToWalletDto>({
    chargeStackId: Joi.string().required(),
    chargeType: Joi.string()
        .required()
        .valid(...allowedChargeTypes),
    walletId: Joi.string().required(),
});
