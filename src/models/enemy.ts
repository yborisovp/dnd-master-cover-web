export interface ApiEnemy {
  name: string;
  danger: number;
  link: string;
}

export interface EnemyData {
  id: number;
  externalId: string;
  name: string;
  dangerLevel: number;
  hp: number;
  maxHp?: number; // If not provided, we treat hp as max
  class: string;
  description: string;
  abilities: Ability[];
  link: string;
  stats: Stats[];
}

export interface Stats {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export interface Ability {
  weaponType: string;
  attackDiceRoll: string | null;
  hitDiceRoll: string | null;
  damageType: string | null;
  description: string;
}


export interface EnemyHolder {
  id: number;
  groupName: string;
  enemies: EnemyData[];
}
