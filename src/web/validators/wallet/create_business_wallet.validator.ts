import Joi from "joi";
import { CreateWalletDto } from "@logic/wallet";
import { allowedPaidBy } from "@logic/charges";

export const CreateBusinessWalletValidator = Joi.object<CreateWalletDto>({
    currency: Joi.string().required(),
    email: Joi.string().required().email(),
    fundingChargesPaidBy: Joi.string()
        .valid(...allowedPaidBy)
        .optional(),
    withdrawalChargesPaidBy: Joi.string()
        .valid(...allowedPaidBy)
        .optional(),
    waiveFundingCharges: Joi.boolean().optional(),
    waiveWithdrawalCharges: Joi.boolean().optional(),
    waiveWalletInCharges: Joi.boolean().optional(),
    waiveWalletOutCharges: Joi.boolean().optional(),
});
