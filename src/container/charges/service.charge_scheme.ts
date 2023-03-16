import { ChargesService } from "@logic/charges";
import { chargeStackRepo } from "./repo.charge_scheme";

export const chargesService = new ChargesService({ repo: chargeStackRepo });
