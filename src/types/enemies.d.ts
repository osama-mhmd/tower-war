import {
  AggressiveEntity,
  DestroyableAggressiveEntity,
  DestroyableEntity,
} from "./entities";
import { Context, Point } from "./global";
import { Tower } from "./towers";

export default interface Enemy extends DestroyableEntity {
  visibility?: boolean;
  type?: "ground" | "air"; // default "ground"
  speed: number;
  waypoints: Point[];
  currentWaypointIndex: number;
  /**
   * The prize the user gets when the entity is killed
   * @default 5
   */
  prize?: number;

  // functions
  update(towers: Tower[], gameTime: number): void;
  draw(ctx: Context): void;
}
export interface AggressiveEnemy extends AggressiveEntity, Enemy {}
