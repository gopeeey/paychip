import * as utilFuncs from "src/utils/functions";
import * as errorLoggerModule from "src/utils/error_logger";

export const generateIdMock = jest.spyOn(utilFuncs, "generateId");
export const generateAuthTokenMock = jest.spyOn(utilFuncs, "generateAuthToken");
export const validateBusinessObjectIdMock = jest.spyOn(utilFuncs, "validateBusinessObjectId");
export const logErrorMock = jest.spyOn(errorLoggerModule, "logError");
