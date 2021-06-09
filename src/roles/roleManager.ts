export interface RoleManager {
  act: (spirit: Spirit) => void;
}

export class DummyRoleManager implements RoleManager {
  act = (spirit: Spirit) => {

  }
}