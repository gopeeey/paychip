/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    testMatch: ["**/**/*.int.test.int.ts"],
    verbose: true,
    clearMocks: true,
};
