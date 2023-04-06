import * as utilFuncs from "src/utils";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { PermissionDeniedError } from "@logic/base_errors";

type ObjType = { [key: string]: any } | string;

const jwtTestSecret = "myTestSecret_shhhh";
const jwtTestData: ObjType[] = [
    { name: "person", anotherProp: "something else" },
    { property: "car", anArray: [] },
    { something: "anObject", anObject: { nest: "yes" } },
    { something: "pool", someone: "Sam" },
    { property: "stock" },
    { object: "gaming pc", account: "me" },
    "something",
];
const jwts: string[] = [];

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
            for (const obj of jwtTestData) {
                const theJwt = utilFuncs.generateJwt(obj, jwtTestSecret);
                jwts.push(theJwt);
                const jwtPayload = jwt.verify(theJwt, jwtTestSecret);
                if (typeof obj === "string") expect(jwtPayload).toBe(obj);
                if (typeof obj === "object") {
                    expect(typeof jwtPayload).toBe("object");
                    Object.keys(obj).forEach((key) => {
                        expect(jwtPayload as JwtPayload).toHaveProperty(key, obj[key]);
                    });
                }
            }
        });
    });

    describe("Testing fn verifyJwt", () => {
        it("should return the expected object", () => {
            for (let i = 0; i < jwts.length; i++) {
                const token = jwts[i];
                const obj = jwtTestData[i];
                const jwtPayload = utilFuncs.verifyJwt(token, jwtTestSecret);

                if (typeof obj === "string") expect(jwtPayload).toBe(obj);
                if (typeof obj === "object") {
                    expect(typeof jwtPayload).toBe("object");
                    Object.keys(obj).forEach((key) => {
                        expect(jwtPayload as JwtPayload).toHaveProperty(key, obj[key]);
                    });
                }
            }
        });
    });

    describe("Testing fn generateAuthToken", () => {
        describe("Given invalid data", () => {
            it("should throw an error", () => {
                const invalidData: {
                    authType: "account" | "business";
                    payload: { businessId?: string; accountId?: string };
                    error: string;
                }[] = [
                    {
                        authType: "account",
                        payload: { businessId: "fish" },
                        error: "accountId is required for authType account",
                    },
                    {
                        authType: "business",
                        payload: { businessId: "fish" },
                        error: "accountId is required for authType business",
                    },
                    {
                        authType: "business",
                        payload: { accountId: "fish" },
                        error: "businessId is required for authType business",
                    },
                    {
                        authType: "business",
                        payload: {},
                        error: "accountId is required for authType business",
                    },
                    {
                        authType: "account",
                        payload: {},
                        error: "accountId is required for authType account",
                    },
                ];

                for (let i = 0; i < invalidData.length; i++) {
                    const data = invalidData[i];
                    expect(() => {
                        utilFuncs.generateAuthToken(
                            data.authType,
                            data.payload as {
                                accountId?: string | undefined;
                                businessId?: number | undefined;
                            }
                        );
                    }).toThrow(data.error);
                }
            });
        });

        describe("Given valid data", () => {
            it("should return a jwt", () => {
                const validData: {
                    authType: "account" | "business";
                    payload: { businessId?: number; accountId?: string };
                }[] = [
                    {
                        authType: "account",
                        payload: { accountId: "fish" },
                    },
                    {
                        authType: "business",
                        payload: { accountId: "meat", businessId: 123 },
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

    describe("Testing generateId", () => {
        it("should return a string that's different on each call", () => {
            let count = 10;
            let prevString: string = "";
            while (count > 0) {
                const newString = utilFuncs.generateId();
                expect(newString).not.toBe(prevString);
                prevString = newString;
                count--;
            }
        });

        describe("Given a suffix", () => {
            it("should return a string with the suffix appended", () => {
                const suffixes = ["me", "you", "us", "molybdenum"];
                suffixes.forEach((suffix) => {
                    const str = utilFuncs.generateId(suffix);
                    expect(str.lastIndexOf(suffix)).toBe(str.length - suffix.length);
                });
            });
        });
    });

    describe("Testing validateBusinessObjectId", () => {
        describe("Given the objectIds are not valid", () => {
            it("should throw a permission denied error", () => {
                const businessId = 11111;
                const invalidIdSets = [
                    ["what", "are", "you", "saying"],
                    ["some", "contain" + businessId],
                ];
                invalidIdSets.forEach((idSet) => {
                    try {
                        utilFuncs.validateBusinessObjectId(idSet, businessId);
                    } catch (err) {
                        expect(err).toBeInstanceOf(PermissionDeniedError);
                    }
                });
            });
        });

        describe("Given the objectIds are valid", () => {
            it("should do nothing", () => {
                const businessId = 1234;
                const validIdSets = [
                    ["weare" + businessId, "another" + businessId],
                    ["my" + businessId, "name" + businessId],
                ];

                validIdSets.forEach((idSet) => {
                    const val = utilFuncs.validateBusinessObjectId(idSet, businessId);
                    expect(val).toBeUndefined();
                });
            });
        });
    });
});
