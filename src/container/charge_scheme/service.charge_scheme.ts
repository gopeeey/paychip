import { ChargeStackService } from "@logic/charges";
import { chargeStackRepo } from "./repo.charge_scheme";

export const chargeStackService = new ChargeStackService({ repo: chargeStackRepo });
