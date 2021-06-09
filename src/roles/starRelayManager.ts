import { EnergyState, Role } from "../types";
import { getEmptiestFillingByRole, isEmpty, isFull, moveAndEnergize } from "../utils";
import { RoleManager } from "./roleManager";

export class StarRelayManager implements RoleManager {
  act = (spirit: Spirit) => {
    if (isEmpty(spirit)) {
      memory[spirit.id].energyState = EnergyState.FILLING;
    }

    if (isFull(spirit)) {
      memory[spirit.id].energyState = EnergyState.CHARGING;
    }

    if (memory[spirit.id].energyState === EnergyState.FILLING) {
      moveAndEnergize(spirit, star_zxq);
    }

    if (memory[spirit.id].energyState === EnergyState.CHARGING) {
      const nearestMidRelay = getEmptiestFillingByRole(spirit, Role.MID_RELAY);
      if (nearestMidRelay) {
        moveAndEnergize(spirit, nearestMidRelay);
      }
    }
  };
}