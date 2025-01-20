import { describe, it, expect, beforeEach } from "vitest";
import { Rocket } from "@/entities/projectiles";
import { TILE_SIZE } from "@/config/constants";
import { RocketConfig } from "@/types/bullets";

export class MockEnemy {
  x: number;
  y: number;
  health: number;
  expecetedHealth?: number;

  constructor(x: number, y: number, health: number) {
    this.x = x;
    this.y = y;
    this.health = health;
  }
}

describe("Rocket Entity", () => {
  let rocket: Rocket;
  let target: MockEnemy;
  let config: RocketConfig;

  beforeEach(() => {
    target = new MockEnemy(10, 10, 100);
    config = {
      x: 0,
      y: 0,
      speed: 5,
      damage: 20,
      texture: "towerDefense_tile252",
      target,
    };
    rocket = new Rocket(config);
  });

  it("should initialize properties correctly", () => {
    expect(rocket.x).toBe(0);
    expect(rocket.y).toBe(0);
    expect(rocket.speed).toBe(5);
    expect(rocket.damage).toBe(20);
    expect(rocket.isDestroyed).toBe(false);
    expect(rocket.target).toBe(target);
    expect(rocket.offsetX).toBe(-TILE_SIZE / 2);
    expect(rocket.offsetY).toBe(-TILE_SIZE / 2);
    expect(rocket.texture).toBe("towerDefense_tile252");
    expect(target.expecetedHealth).toBe(80);
  });

  it("should move toward the target", () => {
    const dx = target.x - rocket.x;
    const dy = target.y - rocket.y;
    const distance = Math.hypot(dx, dy);
    const expectedX = rocket.x + (dx / distance) * rocket.speed;
    const expectedY = rocket.y + (dy / distance) * rocket.speed;

    rocket.update();

    expect(rocket.x).toBeCloseTo(expectedX);
    expect(rocket.y).toBeCloseTo(expectedY);
    expect(rocket.angle).toBeCloseTo(Math.atan2(dy, dx));
  });

  it("should destroy itself and damage the target when it reaches it", () => {
    rocket.x = 9;
    rocket.y = 9;

    rocket.update();

    expect(rocket.isDestroyed).toBe(true);
    expect(target.health).toBe(80);
  });

  it("should destroy itself if there is no target", () => {
    rocket.target = undefined;
    rocket.update();

    expect(rocket.isDestroyed).toBe(true);
  });

  it("should not move or damage if the target is already destroyed", () => {
    target.health = 0;
    rocket.update();

    expect(rocket.isDestroyed).toBe(true);
    expect(target.health).toBe(0);
  });
});
