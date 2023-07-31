export interface BaseResponseInterface {
    status: boolean;
    message: string;
}

export interface InitializeTransactionResponseInterface extends BaseResponseInterface {
    data: {
        authorization_url: string;
        access_code: string;
        reference: string;
    };
}

export interface VerifyTransactionResponseInterface extends BaseResponseInterface {
    data: {
        id: number;
        status: "success" | "failed";
        reference: string;
        amount: number;
        channel: string;
        authorization?: {
            authorization_code: string;
            bin: string | null;
            last4: string | null;
            exp_month: string | null;
            channel: "bank_transfer" | "card" | null;
            card_type: string | null;
            bank: string | null;
            brand: string | null;
            reusable: boolean;
            account_name: string | null;
            sender_name: string | null;
            sender_bank_account_number: string | null;
            receiver_bank_account_number: string | null;
            receiver_bank: string | null;
        };
        customer: {
            first_name: string | null;
            last_name: string | null;
            phone: string | null;
            email: string;
            metadata?: {
                calling_code?: string | null;
            };
        };
    };
}

export interface VerifyBankDetailsResponseInterface extends BaseResponseInterface {
    data: {
        account_number: string;
        account_name: string;
    };
}

export interface TransferRecipient {
    recipientId: string;
    accountNumber: string;
    bankCode: string;
    currency: string;
}

export interface CreateTransferRecipientResponseInterface extends BaseResponseInterface {
    data: {
        recipient_code: string;
        details: {
            account_number: string;
            bank_code: string;
        };
    };
}

export interface SendMoneyResponseInterface extends BaseResponseInterface {
    data: {
        amount: number;
        status: string;
        transfer_code: string;
    };
}

export interface VerifyTransferReponseInterface extends BaseResponseInterface {
    data: {
        status: "success" | "failed" | "pending";
        transfer_code: string;
    };
}
