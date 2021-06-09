import { EnergyState, Role } from "./types";

export function dist(a: Entity, b: Entity) {
  const x = a.position[0] - b.position[0];
  const y = a.position[1] - b.position[1];
  return Math.sqrt(x * x + y * y);
}

export function initMemory(spirit: Spirit) {
  memory[spirit.id] = {
    role: Role.DEFAULT,
    energyState: EnergyState.CHARGING
  };
}

export function getNearestStar(spirit: Spirit) {
  return (dist(spirit, star_zxq) > dist(spirit, star_a1c))
    ? star_a1c
    : star_zxq;
}

export function isMemoryInitialized(spirit: Spirit) {
  return Boolean(memory[spirit.id]);
}

export function numTotal() {
  return my_spirits.filter(s => s.energy >= 0).length;
}

export function assignRole(spirit: Spirit, role: Role) {
  memory[spirit.id].role = role;
}

export function getRole(spirit: Spirit): Role {
  return memory[spirit.id].role;
}

export function numRole(role: Role) {
  return my_spirits.filter(spirit =>
    memory[spirit.id] &&
    memory[spirit.id].role === role &&
    spirit.energy >= 0
  ).length;
}

export function existsRole(role: Role) {
  return numRole(role) > 0;
}

export function isFull(spirit: Spirit) {
  return spirit.energy === spirit.energy_capacity;
}

export function isEmpty(spirit: Spirit) {
  return spirit.energy === 0;
}

export function moveTo(spirit: Spirit, target: Entity) {
  if (!target) {
    return;
  }
  if (dist(spirit, target) > 200) {
    spirit.move(target.position);
  }
}

export function moveAndEnergize(spirit: Spirit, target: ArtificialEntity) {
  moveTo(spirit, target);
  spirit.energize(target);
}

export function getNearest(spirit: Spirit, entities: Spirit[]) {
  if (entities.length < 1) {
    return;
  }

  return entities.map(e => ({
    e,
    distance: dist(spirit, e)
  })).sort((a, b) => a.distance - b.distance)[0].e;
}

export function sortByEnergy(spirits: Spirit[], order: 'asc' | 'desc') {
return spirits.sort((a, b) => order === 'asc' ? a.energy - b.energy : b.energy - a.energy);
}

export function getEmptiest(spirit: Spirit, entities: Spirit[]) {
  if (entities.length < 1) {
    return;
  }

  return sortByEnergy(entities, 'asc')[0];
}

export function getNearestByRole(spirit: Spirit, role: Role) {
  const spirits = my_spirits.filter(s =>
    s.id !== spirit.id &&
    memory[s.id] &&
    memory[s.id].role === role &&
    s.energy >= 0
  );
  return getNearest(spirit, spirits);
}

export function getEmptiestFillingByRole(spirit: Spirit, role: Role) {
  const spirits = my_spirits.filter(s =>
    memory[s.id] &&
    memory[s.id].role === role &&
    memory[s.id].energyState === EnergyState.FILLING &&
    s.energy >= 0
  );
  return getEmptiest(spirit, spirits);
}