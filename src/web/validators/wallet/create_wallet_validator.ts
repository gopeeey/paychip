import Joi from "joi";
import { CreateWalletDto } from "@logic/wallet";
import { allowedPaidBy } from "@logic/charges";

export const CreateWalletValidator = Joi.object<CreateWalletDto>({
    currency: Joi.string().required(),
    email: Joi.string().required().email(),
    fundingChargesPaidBy: Joi.string()
        .valid(...allowedPaidBy)
        .optional()
        .allow(null),
    withdrawalChargesPaidBy: Joi.string()
        .valid(...allowedPaidBy)
        .optional()
        .allow(null),
    waiveFundingCharges: Joi.boolean().optional(),
    waiveWithdrawalCharges: Joi.boolean().optional(),
    waiveWalletInCharges: Joi.boolean().optional(),
    waiveWalletOutCharges: Joi.boolean().optional(),
});
