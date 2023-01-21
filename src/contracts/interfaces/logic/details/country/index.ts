import { GetCountryByCodeType } from "./get_country_by_code.detail.interface";
import { CheckCountrySupportedType } from "./check_country_supported.detail";

export * from "./check_country_supported.detail";
export * from "./get_country_by_code.detail.interface";

export interface CountryDetails {
    getCountryByCode: GetCountryByCodeType;
}
