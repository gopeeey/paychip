import * as utilFuncs from "../../utils/functions";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";

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
});
