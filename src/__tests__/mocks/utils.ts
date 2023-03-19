import * as utilFuncs from "src/utils/functions";

export const generateIdMock = jest.spyOn(utilFuncs, "generateId");
export const generateAuthTokenMock = jest.spyOn(utilFuncs, "generateAuthToken");
export const validateBusinessObjectIdMock = jest.spyOn(utilFuncs, "validateBusinessObjectId");
