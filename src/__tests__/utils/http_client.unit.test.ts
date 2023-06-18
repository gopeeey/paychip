import { HttpClient, HttpError } from "src/utils";
import axios, { AxiosError, AxiosHeaders, AxiosResponse } from "axios";
import { createClassSpies } from "src/__tests__/helpers/mocks";

const client = new HttpClient();
const axiosSpy = createClassSpies(axios, ["post", "get"]);

const errorMessage = "This is a thing";
const statusCode = "400";
const statusText = "Bad request";

const headers = new AxiosHeaders();
const axiosError = new AxiosError("Testing", statusCode, {
    headers,
    data: { message: errorMessage },
    responseType: "json",
});
axiosError.response = {
    config: { headers },
    data: { message: errorMessage },
    status: parseInt(statusCode, 10),
    headers: headers,
    statusText,
};

const httpError = new HttpError({ message: errorMessage, statusCode: parseInt(statusCode, 10) });

const sampleResponseData = { answer: "Do the things that make you happy" };

const axiosResponse: AxiosResponse = {
    config: { headers },
    data: sampleResponseData,
    headers,
    status: 200,
    statusText: "OK",
};

describe("Testing HttpClient", () => {
    describe(">>> errorHandler", () => {
        it("should throw a http error object with the correct status code", () => {
            const ignore = "this";

            try {
                HttpClient.errorHandler(axiosError);
                throw new Error(ignore);
            } catch (err) {
                if (err instanceof Error && err.message === ignore)
                    throw new Error("Did not throw error");
                if (!(err instanceof HttpError)) throw new Error("Threw unknown error");
                expect(err).toBeInstanceOf(HttpError);
                expect(err.message).toBe(errorMessage);
                expect(err.statusCode).toBe(parseInt(statusCode));
            }

            try {
                const error = new Error(errorMessage);
                HttpClient.errorHandler(error);
                throw new Error(ignore);
            } catch (err) {
                if (err instanceof Error && err.message === ignore)
                    throw new Error("Did not throw error");
                if (!(err instanceof HttpError)) throw new Error("Threw unknown error");
                expect(err).toBeInstanceOf(HttpError);
                expect(err.message).toBe(errorMessage);
                expect(err.statusCode).toBeUndefined();
            }
        });
    });

    describe(">>> post", () => {
        describe("given the request succeeds", () => {
            it("should return the response data", async () => {
                axiosSpy.post.mockResolvedValue(axiosResponse);
                const body = { question: "What do I do with my life?" };
                const data = await client.post({ url: "https://google.com", body });
                expect(data).toEqual(sampleResponseData);
            });
        });

        describe("given the request fails", () => {
            it("should throw a http error", async () => {
                axiosSpy.post.mockRejectedValue(axiosError);
                const body = { question: "What do I do with my life?" };
                await expect(() =>
                    client.post({ url: "https://google.com", body })
                ).rejects.toThrow(httpError);
            });
        });
    });

    describe(">>> get", () => {
        describe("given the request succeeds", () => {
            it("should return the response data", async () => {
                axiosSpy.get.mockResolvedValue(axiosResponse);
                const data = await client.get("https://google.com");
                expect(data).toEqual(sampleResponseData);
            });
        });

        describe("given the request fails", () => {
            it("should throw a http error", async () => {
                axiosSpy.get.mockRejectedValue(axiosError);
                await expect(() => client.get("https://google.com")).rejects.toThrow(httpError);
            });
        });
    });
});
