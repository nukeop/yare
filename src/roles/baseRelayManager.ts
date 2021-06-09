import { EnergyState, Role } from "../types";
import { dist, getNearestByRole, isEmpty, isFull, moveAndEnergize, moveTo } from "../utils";
import { RoleManager } from "./roleManager";

export class BaseRelayManager implements RoleManager {
  act = (spirit: Spirit) => {
    if (isEmpty(spirit)) {
      memory[spirit.id].energyState = EnergyState.FILLING;
    }

    if (spirit.energy > spirit.energy_capacity/2) {
      memory[spirit.id].energyState = EnergyState.CHARGING;
    }

    if (memory[spirit.id].energyState === EnergyState.FILLING) {
      const nearestMidRelay = getNearestByRole(spirit, Role.MID_RELAY);
      if (
        nearestMidRelay &&
        dist(spirit, nearestMidRelay) > dist(spirit, base)
      ) {
        moveTo(spirit, nearestMidRelay);
      }
    }

    if (memory[spirit.id].energyState === EnergyState.CHARGING) {
      moveAndEnergize(spirit, base);
    }
  }
}