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
        };
    };
}
