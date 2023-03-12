import Joi from "joi";
import { CreateWalletDto, allowedWalletTypes } from "@logic/wallet";

export const CreateBusinessWalletValidator = Joi.object<CreateWalletDto>({
    currency: Joi.string().required(),
    email: Joi.string().required().email(),
    walletType: Joi.string()
        .required()
        .valid(...allowedWalletTypes),
    waiveFundingCharges: Joi.boolean().optional(),
    waiveWithdrawalCharges: Joi.boolean().optional(),
    waiveWalletInCharges: Joi.boolean().optional(),
    waiveWalletOutCharges: Joi.boolean().optional(),
});
