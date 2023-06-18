import {
    BusinessCreator,
    BusinessService,
    BusinessServiceDependenciesInterface,
    BusinessNotFoundError,
    UnauthorizedBusinessAccessError,
} from "@business/logic";
import {
    accountJson,
    businessData,
    businessJson,
    businessJsonArr,
    businessLevelToken,
} from "src/__tests__/samples";

import { generateAuthTokenMock, sessionMock } from "src/__tests__/mocks";

const businessCreatorSpy = jest.spyOn(BusinessCreator.prototype, "create");

const repo = {
    create: jest.fn(),
    findById: jest.fn(),
    getOwnerBusinesses: jest.fn(),
};

const dependencies = {
    repo,
    startSession: jest.fn(async () => sessionMock),
    getCountry: jest.fn(),
    getAccount: jest.fn(),
    createBusinessWallet: jest.fn(),
};

const businessService = new BusinessService(
    dependencies as unknown as BusinessServiceDependenciesInterface
);

const getByIdMock = jest.spyOn(businessService, "getById");

describe("TESTING BUSINESS SERVICE", () => {
    describe("Testing createBusiness", () => {
        describe("Given it is passed a session", () => {
            it("should NOT start it's own session", async () => {
                businessCreatorSpy.mockResolvedValue(businessJson);
                await businessService.createBusiness(businessData, sessionMock);
                expect(dependencies.startSession).not.toHaveBeenCalled();
            });

            describe("given no errors occur", () => {
                it("should not commit any changes made", async () => {
                    await businessService.createBusiness(businessData, sessionMock);
                    expect(sessionMock.commit).not.toHaveBeenCalled();
                });
            });

            describe("given an error occurs", () => {
                it("should NOT try to roll back changes", async () => {
                    await businessService.createBusiness(businessData, sessionMock);
                    expect(sessionMock.rollback).not.toHaveBeenCalled();
                });
            });
        });

        describe("Given it is NOT passed a session", () => {
            it("should start it's own session", async () => {
                businessCreatorSpy.mockResolvedValue(businessJson);
                await businessService.createBusiness(businessData);
                expect(dependencies.startSession).toHaveBeenCalled();
            });
            describe("given no errors occur", () => {
                it("should commit all changes made", async () => {
                    await businessService.createBusiness(businessData);
                    expect(sessionMock.commit).toHaveBeenCalledTimes(1);
                });
            });
            describe("given an error occurs", () => {
                it("should roll back changes", async () => {
                    businessCreatorSpy.mockRejectedValue(new Error());
                    try {
                        await businessService.createBusiness(businessData);
                    } catch (err) {}
                    expect(sessionMock.rollback).toHaveBeenCalledTimes(1);
                });
            });
        });

        it("should return a business object", async () => {
            businessCreatorSpy.mockResolvedValue(businessJson);
            const business = await businessService.createBusiness(businessData);
            expect(business).toEqual(businessJson);
            expect(businessCreatorSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe("Testing getById", () => {
        describe("Given the business exists", () => {
            it("should return a business object", async () => {
                repo.findById.mockResolvedValue(businessJson);
                const result = await businessService.getById(businessJson.id);
                expect(result).toEqual(businessJson);
                expect(repo.findById).toHaveBeenCalledTimes(1);
                expect(repo.findById).toHaveBeenCalledWith(businessJson.id);
            });
        });

        describe("Given the business does not exist", () => {
            it("should throw an error", async () => {
                repo.findById.mockResolvedValue(null);
                expect(businessService.getById(businessJson.id)).rejects.toThrow(
                    new BusinessNotFoundError()
                );
                expect(repo.findById).toHaveBeenCalledTimes(1);
                expect(repo.findById).toHaveBeenCalledWith(businessJson.id);
            });
        });
    });

    describe("Testing getOwnerBusinesses", () => {
        describe("Given the owner has businesses", () => {
            it("should return a business object array", async () => {
                repo.getOwnerBusinesses.mockResolvedValue(businessJsonArr);
                const result = await businessService.getOwnerBusinesses(accountJson.id);
                expect(result).toEqual(businessJsonArr);
                expect(repo.getOwnerBusinesses).toHaveBeenCalledTimes(1);
                expect(repo.getOwnerBusinesses).toHaveBeenCalledWith(accountJson.id);
            });
        });

        describe("Given the owner has no businesses", () => {
            it("should return an empty array", async () => {
                repo.getOwnerBusinesses.mockResolvedValue([]);
                const result = await businessService.getOwnerBusinesses(accountJson.id);
                expect(result).toEqual([]);
                expect(repo.getOwnerBusinesses).toHaveBeenCalledTimes(1);
                expect(repo.getOwnerBusinesses).toHaveBeenCalledWith(accountJson.id);
            });
        });
    });

    describe("Testing getBusinessAccessToken", () => {
        it("should check if the user is the owner of the business", async () => {
            getByIdMock.mockResolvedValue(businessJson);
            generateAuthTokenMock.mockReturnValue(businessLevelToken);
            await businessService.getBusinessAccessToken(businessJson.id, businessJson.ownerId);
            expect(getByIdMock).toHaveBeenCalledTimes(1);
            expect(getByIdMock).toHaveBeenCalledWith(businessJson.id);
        });

        describe("Given the user is not the owner of the business", () => {
            it("should throw an unauthorized business access error", async () => {
                getByIdMock.mockResolvedValue({ ...businessJson, ownerId: "5555" });
                await expect(
                    businessService.getBusinessAccessToken(businessJson.id, businessJson.ownerId)
                ).rejects.toThrow(new UnauthorizedBusinessAccessError());
            });
        });

        describe("Given the user is the owner of the business", () => {
            it("should generate and return a business jwt token", async () => {
                getByIdMock.mockResolvedValue(businessJson);
                const token = await businessService.getBusinessAccessToken(
                    businessJson.id,
                    businessJson.ownerId
                );
                expect(token).toBe(businessLevelToken);
                expect(generateAuthTokenMock).toHaveBeenCalledTimes(1);
                expect(generateAuthTokenMock).toHaveBeenCalledWith("business", {
                    accountId: businessJson.ownerId,
                    businessId: businessJson.id,
                });
            });
        });
    });
});
