export interface InitiativeCharacter {
  id: string;
  name: string;
  initiative?: number;
  type: "player" | "enemy";
}
