import { EnergyState } from "../types";
import { getNearest, getNearestStar, isEmpty, isFull, moveAndEnergize, moveTo } from "../utils";
import { RoleManager } from "./roleManager";

export class GuardRoleManager implements RoleManager {
  act = (spirit: Spirit) => {
    if (isEmpty(spirit)) {
      memory[spirit.id].energyState = EnergyState.FILLING;
    }

    if (isFull(spirit)) {
      memory[spirit.id].energyState = EnergyState.CHARGING;
    }
    
    if (memory[spirit.id].energyState === EnergyState.FILLING) {
      moveAndEnergize(spirit, getNearestStar(spirit));
    }

    if (memory[spirit.id].energyState === EnergyState.CHARGING) {
      if (spirit.sight.enemies.length > 0) {
        const nearestEnemy = getNearest(spirit, spirit.sight.enemies.map(id => spirits[id]));
        if(nearestEnemy) {
          moveAndEnergize(spirit, nearestEnemy);
        }
      } else {
        moveTo(spirit, base);
      }
    }
  }
}