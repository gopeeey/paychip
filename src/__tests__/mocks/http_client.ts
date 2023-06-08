import * as HttpClientModule from "src/utils/http_client";

export const HttpClientInstanceMock = { post: jest.fn(), get: jest.fn() };
export const HttpClientClassMock =
    HttpClientModule.HttpClient as unknown as jest.Mock<HttpClientModule.HttpClient>;
