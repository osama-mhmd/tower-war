import Game from "@/types/game";
import { Coins, Heart, Skull } from "lucide-react";
import DevMode from "./dev-mode";

export default function GameStatus({
  game,
  setGame,
}: {
  game: Game;
  setGame(game: Partial<Game>): void;
}) {
  return (
    <div className="status">
      <p>
        {game.hp} <Heart fill="red" stroke="#d30" />
      </p>
      <p>
        {game.enemiesCount} <Skull fill="#000" stroke="#FF4500" />
        <DevMode>
          <input
            onChange={(e) =>
              setGame({ enemiesCount: +(e.target as HTMLInputElement).value })
            }
            type="range"
            max={200}
            value={game.enemiesCount}
          />
        </DevMode>
      </p>
      <p>
        {game.coins} <Coins fill="#000" stroke="#45FF00" />
      </p>
    </div>
  );
}
