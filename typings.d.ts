declare type Position = [x: number, y: number];
declare type Sight = {
  friends: string[];
  friends_beamable: string[];
  enemies: string[];
  enemies_beamable: string[];
  structures: string[];
};

declare type Entity = {
  id: string;
  position: Position;
}

declare interface ArtificialEntity extends Entity {
	size: number;
	energy_capacity: number;
	energy: number;
	hp: 0 | 1;
	sight: Sight;
	player_id: string;
	shape: "circles" | "squares" | "triangles";
	color: string;
}

declare interface Spirit extends ArtificialEntity {
  mark: string;

  energize: (target: ArtificialEntity) => void;
  move: (target: Position) => void;
  shout: (message: string) => void;
	set_mark: (label: string) => void;
}

declare interface Structure extends Entity {
	structure_type: string;
}

declare interface Base extends Structure, ArtificialEntity {
	id: `base_${string}`;
	structure_type: 'base';
	size: 40;
	sight: Sight;
	current_spirit_cost: number;
}

declare interface Star extends Structure, ArtificialEntity {
	id: `star_${string}`;
	structure_type: 'star';
	position: Position;
}

declare const spirits: Record<string, Spirit>;
declare const my_spirits: Spirit[];
declare const base: Base;
declare const enemy_base: Base;
declare const star_zxq: Star;
declare const star_a1c: Star;
declare const memory: Record<string, any>;