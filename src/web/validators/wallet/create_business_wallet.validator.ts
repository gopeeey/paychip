import Joi from "joi";
import { CreateWalletDto } from "../../../contracts/dtos";
import { allowedWalletTypes } from "../../../contracts/interfaces";

export const CreateBusinessWalletValidator = Joi.object<CreateWalletDto>({
    currency: Joi.string().required(),
    chargeSchemeId: Joi.string().optional(),
    email: Joi.string().required().email(),
    waiveFundingCharges: Joi.boolean().optional(),
    waiveWithdrawalCharges: Joi.boolean().optional(),
    walletType: Joi.string()
        .required()
        .valid(...allowedWalletTypes),
});
