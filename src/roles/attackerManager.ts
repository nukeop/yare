import { EnergyState, Role } from "../types";
import { dist, getNearestByRole, getNearestStar, isEmpty, isFull, moveAndEnergize, moveTo } from "../utils";
import { RoleManager } from "./roleManager";

export class AttackerRoleManager implements RoleManager {
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
      const nearestAttacker = getNearestByRole(spirit, Role.ATTACKER);
      if (nearestAttacker && dist(spirit, nearestAttacker) > 50) {
        moveTo(spirit, nearestAttacker);
      } else {
        moveAndEnergize(spirit, enemy_base);
      }
    }
  }
}