import bcrypt from "bcrypt";
import config from "../config";
import jwt from "jsonwebtoken";

export const hashString = async (string: string) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(string, salt);
    return hash;
};

export const generateJwt = (
    payload: { [key: string]: any } | string,
    secret: string = config.misc.jwtSecret
) => {
    const token = jwt.sign(payload, secret);
    return token;
};

// using this in tests
// to turn return values for mock functions to promises where needed
// of course I wrote a test for it too :)
export const promisifyValue = <T>(val: T) => new Promise<T>((res, rej) => res(val));
