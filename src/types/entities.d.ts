export interface Entity {
  x: number;
  y: number;
  health: number;
  /**
   * @description this property is used to indicate if is there a
   *  tower that have targeted and launched a tower on this entity
   */
  expecetedHealth?: number;
  damage?: number;
  /**
   * Aggressive means if the entity can attack towers or not.
   * @example Tanks are `aggressive`, soliders are not
   * @default false
   */
  aggressive?: boolean;
}
export interface AggressiveEntity extends Entity {
  aggressive?: true;
  damage: number;
  /**
   * @default 0
   */
  minRange?: number;
  maxRange: number;
  lastShot: number;
  attackSpeed: number;
  angle: number;
}
export type State = "alive" | "lost" | "won";
export interface DestroyableEntity extends Entity {
  state: State;
}
export interface DestroyableAggressiveEntity extends AggressiveEntity {
  state: State;
}
