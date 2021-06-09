// import { Role } from "./types";

// function dist(a: Entity, b: Entity) {
//   const x = a.position[0] - b.position[0];
//   const y = a.position[1] - b.position[1];
//   return Math.sqrt(x * x + y * y)
// }

// function getNearestStar(spirit: Spirit) {
//   return (dist(spirit, star_zxq) > dist(spirit, star_a1c))
//     ? star_a1c
//     : star_zxq;
// }

// function getNearest(spirit: Spirit, entities: Spirit[]) {
//   if (entities.length < 1) {
//     return;
//   }

//   return entities.map(e => ({
//     e,
//     distance: dist(spirit, e)
//   })).sort((a, b) => a.distance - b.distance)[0].e;
// }

// function getEmptiest(entities: ArtificialEntity[]) {
//   return entities.sort((a, b) => a.energy - b.energy)[0];
// }

// function numRole(role: Role) {
//   return my_spirits.filter(spirit => memory[spirit.id] === role && spirit.energy >= 0).length;
// }

// function existsRole(role: Role) {
//   return numRole(role) > 0;
// }

// function assignRole(spirit: Spirit, role: Role) {
//   memory[spirit.id] = role;
// }

// function getByRole(role: Role) {
//   return my_spirits.find(s => memory[s.id] === role && s.energy >= 0);
// }

// function getNearestByRole(spirit: Spirit, role: Role) {
//   const spirits = my_spirits.filter(s => memory[s.id] === role && s.energy >= 0);
//   return getNearest(spirit, spirits);
// }

// function getEmptiestByRole(role: Role) {
//   const spirits = my_spirits.filter(s => memory[s.id] === role && s.energy >= 0);
//   return getEmptiest(spirits);
// }

// function numTotal() {
//   return my_spirits.filter(s => s.energy >= 0).length;
// }

// function role(spirit: Spirit) {
//   return memory[spirit.id];
// }

// function isFull(spirit: Spirit) {
//   return spirit.energy === spirit.energy_capacity;
// }

// function isEmpty(spirit: Spirit) {
//   return spirit.energy === 0;
// }

// function enemyBeamableInSight(spirit: Spirit, n: number) {
//   return spirits[spirit.sight.enemies_beamable[n]];
// }

// function moveTo(spirit: Spirit, target: Entity) {
//   if (!target) {
//     return;
//   }
//   if (dist(spirit, target) > 200) {
//     spirit.move(target.position);
//   }
// }

// function moveAndEnergize(spirit: Spirit, target: ArtificialEntity) {
//   moveTo(spirit, target);
//   spirit.energize(target);
// }

// function createAttackers() {
//   const SQUAD_SIZE = 10;
//   const TOTAL_FOR_ATTACKING = 20;

//   if (numRole(Role.ATTACKER) + numRole(Role.LOADER) < SQUAD_SIZE && numTotal() > TOTAL_FOR_ATTACKING) {
//     my_spirits
//       .sort((a, b) => b.energy - a.energy)
//       .slice(0, SQUAD_SIZE)
//       .forEach(s => {
//         memory[s.id] = Role.LOADER;
//       });

//   }
// }

// function assignNewRole(spirit: Spirit) {
//   const GUARD_THRESHOLD = 2;
//   const TOTAL_FOR_GUARDING = 5;

//   const numRelays1 = numRole(Role.BASE_RELAY);
//   const numRelays2 = numRole(Role.MID_RELAY);
//   const numRelays3 = numRole(Role.STAR_RELAY);

//   if (role(spirit) === Role.ATTACKER ||
//     role(spirit) === Role.LOADER ||
//     role(spirit) === Role.GUARD) {
//     return;
//   }

//   const averageRelays = Math.round((numRelays1 + numRelays2 + numRelays3)/3);
//   const equalRelays = numRelays1 === numRelays2 && numRelays2 === numRelays3;

//   if ((role(spirit) === Role.BASE_RELAY ||
//     role(spirit) === Role.MID_RELAY ||
//     role(spirit) === Role.STAR_RELAY) && equalRelays) {
//     return;
//   }

//   if (!role(spirit)) {
//     assignRole(spirit, Role.BASE_RELAY);
//     return;
//   }

//   if (numRelays1+1 < averageRelays) {
//     assignRole(spirit, Role.BASE_RELAY);
//   } else if (numRelays2+1 < averageRelays) {
//     assignRole(spirit, Role.MID_RELAY);
//   } else if (numRelays3+1 < averageRelays) {
//     assignRole(spirit, Role.STAR_RELAY);
//   }

//   if (isFull(spirit) && numRole(Role.GUARD) < GUARD_THRESHOLD && numTotal() > TOTAL_FOR_GUARDING) {
//     memory[spirit.id] = Role.GUARD;
//   }
// }

// my_spirits.forEach(spirit => {
//   assignNewRole(spirit);

//   if (spirit.sight.enemies_beamable.length > 0 && !isEmpty(spirit)) {
//     spirit.energize(enemyBeamableInSight(spirit, 0));
//   }

//   if (role(spirit) === Role.BASE_RELAY) {
//     if (dist(spirit, base) < 175) {
//       moveTo(spirit, star_zxq);
//     } else {
//       moveAndEnergize(spirit, base);
//     }
//   } else if (role(spirit) === Role.MID_RELAY) {

//     const nearestStarRelay = getNearestByRole(spirit, Role.STAR_RELAY);
//     isEmpty(spirit) && nearestStarRelay && moveTo(spirit, nearestStarRelay);
//     existsRole(Role.BASE_RELAY) && moveAndEnergize(spirit, getEmptiestByRole(Role.BASE_RELAY));
//   } else if (role(spirit) === Role.STAR_RELAY) {
//     if (isEmpty(spirit)) {
//       memory['relay-state'] = 'filling';
//     }

//     if (isFull(spirit)) {
//       memory['relay-state'] = 'emptying';
//     }

//     if (memory['relay-state'] === 'filling') {
//       moveAndEnergize(spirit, star_zxq);
//     } else {
//       existsRole(Role.MID_RELAY) && moveAndEnergize(spirit, getEmptiestByRole(Role.MID_RELAY));
//     }

//   } else if (role(spirit) === Role.LOADER) {
//     if (spirit.energy === spirit.energy_capacity) {
//       assignRole(spirit, Role.ATTACKER);
//     }
//     moveAndEnergize(spirit, getNearestStar(spirit));
//   } else if (role(spirit) === Role.ATTACKER) {
//     if (spirit.energy === 0) {
//       assignRole(spirit, Role.LOADER);
//     }

//     moveAndEnergize(spirit, enemy_base);
//   } else if (role(spirit) === Role.GUARD) {
//     spirit.move(base.position);
//     if (spirit.sight.enemies.length > 0 && !isEmpty(spirit)) {
//       const nearestEnemy = getNearest(spirit, spirit.sight.enemies.map(id => spirits[id]))

//       if (nearestEnemy) {
//         moveAndEnergize(spirit, nearestEnemy);
//       }
//     }
//   }

//   if (role(spirit)) {
//     spirit.shout(role(spirit))
//   }
// })

// createAttackers();