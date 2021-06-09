import { AttackerRoleManager } from "./roles/attackerManager";
import { BaseRelayManager } from "./roles/baseRelayManager";
import { GuardRoleManager } from "./roles/guardManager";
import { MidRelayManager } from "./roles/midRelayManager";
import { DummyRoleManager, RoleManager } from "./roles/roleManager";
import { StarRelayManager } from "./roles/starRelayManager";
import { Role } from "./types";
import { assignRole, getRole, initMemory, isMemoryInitialized, numRole, numTotal, sortByEnergy } from "./utils";

const managers: Record<Role, RoleManager> = {
  [Role.STAR_RELAY]: new StarRelayManager(),
  [Role.MID_RELAY]: new MidRelayManager(),
  [Role.BASE_RELAY]: new BaseRelayManager(),
  [Role.ATTACKER]: new AttackerRoleManager(),
  [Role.GUARD]: new GuardRoleManager(),
  [Role.DEFAULT]: new DummyRoleManager()
}

const POP_THRESHOLD_FOR_ATTACK = 20;
const SQUAD_SIZE = 3;
const MAX_GUARDS = 3;

function assignRoles() {
  my_spirits.forEach(spirit => {
    !isMemoryInitialized(spirit) && initMemory(spirit);

    const currentRole = getRole(spirit);
    if(currentRole === Role.ATTACKER || currentRole === Role.GUARD) {
      return
    }

    if (currentRole === Role.DEFAULT) {
      assignRole(spirit, Role.STAR_RELAY);
    }

    if (numRole(Role.STAR_RELAY) > numRole(Role.MID_RELAY)) {
      assignRole(spirit, Role.MID_RELAY);
    }

    if (numRole(Role.MID_RELAY) > numRole(Role.BASE_RELAY)) {
      assignRole(spirit, Role.BASE_RELAY);
    }

    if (numRole(Role.GUARD) < MAX_GUARDS) {
      assignRole(spirit, Role.GUARD);
    }
  });

  const nonAttackers = sortByEnergy(my_spirits, 'desc')
    .filter(spirit => isMemoryInitialized(spirit) && getRole(spirit) !== Role.ATTACKER);

  if (nonAttackers.length > POP_THRESHOLD_FOR_ATTACK) {
    nonAttackers
      .slice(0, SQUAD_SIZE)
      .forEach(spirit => {
        assignRole(spirit, Role.ATTACKER);
      });
  }
}

function actRoles() {
  my_spirits.forEach(spirit => {
    if (getRole(spirit)) {
      managers[getRole(spirit)].act(spirit);
      spirit.shout(getRole(spirit));
    }
  });
}

if (memory[base.id]) {
  console.log(`Energy flow: ${base.energy - memory[base.id]}`)
}
memory[base.id] = base.energy;
console.log(`Population: ${numTotal()}`)

assignRoles();
actRoles();