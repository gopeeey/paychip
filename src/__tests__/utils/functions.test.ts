import * as utilFuncs from "../../utils/functions";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";

const generateJwtMock = jest.spyOn(utilFuncs, "generateJwt");

describe("Testing utility functions", () => {
    describe("Testing fn hashString", () => {
        it("should return a hased string", async () => {
            const pets = [
                "dog",
                "cat",
                "chameleon",
                "iguana",
                "men",
                "women",
                "that got dark pretty fast",
            ];
            for (let i = 0; i < pets.length, i++; ) {
                const pet = pets[i];
                const encrypted = await utilFuncs.hashString(pet);
                await expect(bcrypt.compare(pet, encrypted)).resolves.toBe(true);
            }
        });
    });

    describe("Testing fn generateJwt", () => {
        it("should return a valid jwt", () => {
            type ObjType =
                | {
                      [key: string]: any;
                  }
                | string;
            const objs: ObjType[] = [
                { name: "person", anotherProp: "something else" },
                { property: "car", anArray: [] },
                { something: "anObject", anObject: { nest: "yes" } },
                { something: "pool", someone: "Sam" },
                { property: "stock" },
                { object: "gaming pc", user: "me" },
                "something",
            ];

            for (const obj of objs) {
                const testSecret = "myTestSecret_shhhh";
                const theJwt = utilFuncs.generateJwt(obj, testSecret);
                const jwtPayload = jwt.verify(theJwt, testSecret);
                if (typeof obj === "string") expect(jwtPayload).toBe(obj);
                if (typeof obj === "object") {
                    expect(typeof jwtPayload).toBe("object");
                    Object.keys(obj).forEach((key) => {
                        expect(jwtPayload as JwtPayload).toHaveProperty(key);
                        expect((jwtPayload as JwtPayload)[key]).toEqual(obj[key]);
                    });
                }
            }
        });
    });

    describe("Testing fn generateAuthToken", () => {
        describe("Given invalid data", () => {
            it("should throw an error", () => {
                const invalidData: {
                    authType: "user" | "business";
                    payload: { businessId?: string; userId?: string };
                    error: string;
                }[] = [
                    {
                        authType: "user",
                        payload: { businessId: "fish" },
                        error: "userId is required for authType user",
                    },
                    {
                        authType: "business",
                        payload: { businessId: "fish" },
                        error: "userId is required for authType business",
                    },
                    {
                        authType: "business",
                        payload: { userId: "fish" },
                        error: "businessId is required for authType business",
                    },
                    {
                        authType: "business",
                        payload: {},
                        error: "userId is required for authType business",
                    },
                    {
                        authType: "user",
                        payload: {},
                        error: "userId is required for authType user",
                    },
                ];

                for (let i = 0; i < invalidData.length; i++) {
                    const data = invalidData[i];
                    expect(() => {
                        utilFuncs.generateAuthToken(data.authType, data.payload);
                    }).toThrow(data.error);
                }
            });
        });

        describe("Given valid data", () => {
            it("should return a jwt", () => {
                const validData: {
                    authType: "user" | "business";
                    payload: { businessId?: string; userId?: string };
                }[] = [
                    {
                        authType: "user",
                        payload: { userId: "fish" },
                    },
                    {
                        authType: "business",
                        payload: { userId: "meat", businessId: "fish" },
                    },
                ];

                validData.forEach((data) => {
                    expect(typeof utilFuncs.generateAuthToken(data.authType, data.payload)).toBe(
                        "string"
                    );
                });
            });
        });
    });
});
