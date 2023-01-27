import App from "../../../app";
import supertest from "supertest";
import {
    BusinessServiceInterface,
    DependencyContainerInterface,
} from "../../../contracts/interfaces";
import { testRoute } from "./helpers";
import { businessData } from "../../samples";
import { InvalidLoginDetailsError, ValidationError } from "../../../logic/errors";

const businessServiceMock = jest.fn();
const container = {
    businessService: businessServiceMock,
} as unknown as DependencyContainerInterface;

const app = new App(container);

const testApp = supertest(app);

describe("Testing business routes", () => {
    testRoute("/business/create", (route) => () => {
        // Return 401 if user is not authenticated
        describe("Given user is unauthenticated", () => {
            it("should return status code 401", async () => {
                const dataSet = [
                    // when authToken is not supplied
                    {
                        token: undefined,
                        mock: () => {},
                    },

                    // when given an invalid authToken
                    {
                        token: "asdlfkjlsd",
                        mock: () => {},
                    },
                ];
                const { statusCode, body } = await testApp.post(route).send(businessData);
                expect(statusCode).toBe(400);
                expect(body).toHaveProperty("message");
            });
        });

        // Return 400 when given invalid data
        describe("Given invalid data", () => {
            it("should return status code 400", async () => {
                const { statusCode, body } = await testApp.post(route).send(businessData);
                expect(statusCode).toBe(400);
                expect(body).toHaveProperty("message");
            });
        });
        // Return 400 when the country is not supported
    });
});
