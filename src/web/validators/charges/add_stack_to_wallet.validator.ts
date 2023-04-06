import { AddChargeStackToWalletDto, allowedChargeStackTypes } from "@logic/charges";
import Joi from "joi";

export const AddStackToWalletValidator = Joi.object<AddChargeStackToWalletDto>({
    chargeStackId: Joi.string().required(),
    chargeStackType: Joi.string()
        .required()
        .valid(...allowedChargeStackTypes),
    walletId: Joi.string().required(),
});
