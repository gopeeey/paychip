import axios, { AxiosError } from "axios";
import { HttpError } from "./errors";

interface ClientConfigInterface {
    headers?: { Authorization?: string };
    baseUrl?: string;
}

export interface PostRequestArgsInterface {
    url: string;
    body: { [key: string]: unknown };
}

export class HttpClient {
    private readonly _baseUrl: Exclude<ClientConfigInterface["baseUrl"], undefined> = "";
    private readonly _headers: Exclude<ClientConfigInterface["headers"], undefined> = {};

    constructor(args?: ClientConfigInterface) {
        if (args) {
            if (args.baseUrl) this._baseUrl = args.baseUrl;
            if (args.headers) this._headers = args.headers;
        }
    }

    static errorHandler(err: unknown): never {
        if (err instanceof AxiosError) {
            const httpError = new HttpError({
                message: err.response?.data?.message || err.message,
                data: err.response?.data,
            });
            if (err.code) httpError.statusCode = parseInt(err.code, 10);

            throw httpError;
        }

        if (err instanceof Error) {
            const httpError = new HttpError({
                message: err.message,
            });

            throw httpError;
        }

        throw err;
    }

    async post<ResDataType>(args: PostRequestArgsInterface) {
        try {
            const url = this._baseUrl + args.url;
            const res = await axios.post(url, args.body, { headers: this._headers });
            return res.data as ResDataType;
        } catch (err) {
            HttpClient.errorHandler(err);
        }
    }

    async get<ResDataType>(url: string) {
        try {
            const fullUrl = this._baseUrl + url;
            const res = await axios.get(fullUrl, { headers: this._headers });
            return res.data as ResDataType;
        } catch (err) {
            HttpClient.errorHandler(err);
        }
    }
}
