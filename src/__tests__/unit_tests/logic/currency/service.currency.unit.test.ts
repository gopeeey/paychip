import { CurrencyService, CurrencyServiceDependencies } from "@logic/currency";

const repo = {
    updateBusinessCurrencies: jest.fn(),
    getBusinessCurrencies: jest.fn(),
};

const dependencies = { repo };

const currencyService = new CurrencyService(dependencies as unknown as CurrencyServiceDependencies);

// describe("TESTING CURRENCY SERVICE", () => {});
