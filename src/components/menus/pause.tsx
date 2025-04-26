import Game from "@/types/game";

interface PauseMenuProps {
  mouseClick: () => void;
  setGame(game: Partial<Game>): void;
}

export default function PauseMenu({ mouseClick, setGame }: PauseMenuProps) {
  return (
    <div className="overlay text-2xl" data-testid="pause-menu">
      <p>Paused</p>
      <button
        onClick={() => {
          mouseClick();
          setGame({ state: "running" });
        }}
        className="text-lg"
      >
        Continue
      </button>
    </div>
  );
}
