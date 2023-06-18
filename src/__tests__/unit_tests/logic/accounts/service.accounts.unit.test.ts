import {
    AccountService,
    AccountRepoInterface,
    AccountServiceDependenciesInterface,
    AccountNotFoundError,
    InvalidLoginDetailsError,
} from "@accounts/logic";
import { accountJson, accountData, loginDetails } from "../../../samples/accounts.samples";
import * as utilFuncs from "../../../../utils/functions";
import bcrypt from "bcrypt";

const createMock = jest.fn();
const findByEmailMock = jest.fn();
const findByIdMock = jest.fn();

const bcryptCompareMock = jest
    .spyOn(bcrypt, "compare")
    .mockImplementation(() => Promise.resolve(true));

const repo = {
    create: createMock,
    findByEmail: findByEmailMock,
    findById: findByIdMock,
} as unknown as AccountRepoInterface;

const dependencies = {
    repo,
} as unknown as AccountServiceDependenciesInterface;

const accountService = new AccountService(dependencies);

const createAccountMock = jest.spyOn(accountService, "createAccount");
const hashStringMock = jest.spyOn(utilFuncs, "hashString");
const generateJwtMock = jest.spyOn(utilFuncs, "generateJwt");

describe("Testing account service", () => {
    describe("Testing createAccount", () => {
        describe("Given an account with the same email already exists", () => {
            it("should throw an error", async () => {
                findByEmailMock.mockResolvedValue(accountJson);
                await expect(accountService.createAccount(accountData)).rejects.toThrow(
                    "Email already registered"
                );
                expect(findByEmailMock).toHaveBeenCalledTimes(1);
            });
        });

        describe("Given the email is not already registerd", () => {
            it("should hash the password", async () => {
                findByEmailMock.mockResolvedValue(null);
                hashStringMock.mockResolvedValue("password");
                createMock.mockResolvedValue(accountJson);
                await accountService.createAccount(accountData);
                expect(hashStringMock).toHaveBeenCalledTimes(1);
                expect(hashStringMock).toHaveBeenCalledWith(accountData.password);
            });

            it("should return a new account object", async () => {
                const profile = await accountService.createAccount(accountData);
                expect(profile).toEqual(accountJson);
                expect(createMock).toHaveBeenCalledTimes(1);
                expect(createMock).toHaveBeenCalledWith({
                    ...accountData,
                    password: "password",
                });
            });
        });
    });

    describe("Testing signup", () => {
        // Creates a business for the account
        it("should create an account profile", async () => {
            await accountService.signup(accountData);
            createAccountMock.mockResolvedValue(accountJson);
            expect(createAccountMock).toHaveBeenCalledTimes(1);
            expect(createAccountMock).toHaveBeenCalledWith(accountData);
        });
        // Generates an auth token for the account
        it("should generate an account auth token", async () => {
            generateJwtMock.mockReturnValue("authtoken");
            const response = await accountService.signup(accountData);
            expect(generateJwtMock).toHaveBeenCalledTimes(1);
            expect(generateJwtMock).toHaveBeenCalledWith({
                authType: "account",
                accountId: response.account.id,
            });
        });

        it("should return account and auth token", async () => {
            const response = await accountService.signup(accountData);
            expect(response).toHaveProperty("account");
            expect(response).toHaveProperty("authToken");
            expect(response.account).toEqual(accountJson);
        });
    });

    describe("Testing login", () => {
        it("should fetch the account", async () => {
            findByEmailMock.mockResolvedValue(accountJson);
            await accountService.login(loginDetails);
            expect(findByEmailMock).toHaveBeenCalledTimes(1);
            expect(findByEmailMock).toHaveBeenCalledWith(loginDetails.email);
        });

        describe("Given the account exists", () => {
            it("should compare passwords", async () => {
                await accountService.login(loginDetails);
                expect(bcryptCompareMock).toHaveBeenCalledTimes(1);
                expect(bcryptCompareMock).toHaveBeenCalledWith(
                    loginDetails.password,
                    accountJson.password
                );
            });

            describe("Given the passwords match", () => {
                it("should generate an auth token", async () => {
                    await accountService.login(loginDetails);
                    expect(generateJwtMock).toHaveBeenCalledTimes(1);
                    expect(generateJwtMock).toHaveBeenCalledWith({
                        authType: "account",
                        accountId: accountJson.id,
                    });
                });

                it("should return the account and an auth token", async () => {
                    const authToken = "authTokenValue";
                    generateJwtMock.mockReturnValue(authToken);
                    const response = await accountService.login(loginDetails);
                    expect(response).toHaveProperty("account", accountJson);
                    expect(response).toHaveProperty("authToken", authToken);
                });
            });

            describe("Given the passwords do not match", () => {
                it("should throw an invalid login details error", async () => {
                    bcryptCompareMock.mockImplementation(() => Promise.resolve(false));
                    await expect(
                        accountService.login({
                            email: "sammygopeh@gmail.com",
                            password: "wrongpassword",
                        })
                    ).rejects.toThrow(new InvalidLoginDetailsError());
                });
            });
        });

        describe("Given the account does not exist", () => {
            it("should throw an invalid login details error", async () => {
                findByEmailMock.mockResolvedValue(null);
                await expect(
                    accountService.login({ email: "Sam@gmail.com", password: "barleywheat" })
                ).rejects.toThrow(new InvalidLoginDetailsError());
            });
        });
    });

    describe("Testing getById", () => {
        describe("Given the account exists", () => {
            it("should return a standard account object", async () => {
                findByIdMock.mockResolvedValue(accountJson);
                const result = await accountService.getById(accountJson.id);
                expect(result).toEqual(accountJson);
                expect(findByIdMock).toHaveBeenCalledTimes(1);
                expect(findByIdMock).toHaveBeenCalledWith(accountJson.id);
            });
        });

        describe("Given the account does not exist", () => {
            it("should throw an error", async () => {
                findByIdMock.mockResolvedValue(null);
                expect(accountService.getById(accountJson.id)).rejects.toThrow(
                    new AccountNotFoundError()
                );
                expect(findByIdMock).toHaveBeenCalledTimes(1);
                expect(findByIdMock).toHaveBeenCalledWith(accountJson.id);
            });
        });
    });
});
