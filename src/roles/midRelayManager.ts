import { EnergyState, Role } from "../types";
import { dist, getEmptiestFillingByRole, isEmpty, isFull, moveAndEnergize, moveTo } from "../utils";
import { RoleManager } from "./roleManager";

export class MidRelayManager implements RoleManager {
  act = (spirit: Spirit) => {
    if (isEmpty(spirit)) {
      memory[spirit.id].energyState = EnergyState.FILLING;
    }
    
    if (isFull(spirit)) {
      memory[spirit.id].energyState = EnergyState.CHARGING;
    }

    if(memory[spirit.id].energyState === EnergyState.FILLING) {
      if(dist(spirit, star_zxq) > dist(spirit, base)) {
        moveTo(spirit, star_zxq);
      }
    }

    if(memory[spirit.id].energyState === EnergyState.CHARGING) {
      const nearestBaseRelay = getEmptiestFillingByRole(spirit, Role.BASE_RELAY);
      if (nearestBaseRelay) {
        moveAndEnergize(spirit, nearestBaseRelay);
      }
    }
  }
}