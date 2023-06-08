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
