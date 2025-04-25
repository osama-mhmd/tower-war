import Game from "@/types/game";
import { useRef } from "react";

interface WelcomeProps {
  mouseClick: () => void;
  setGame(game: Partial<Game>): void;
}

export default function Welcome({ mouseClick, setGame }: WelcomeProps) {
  const masterDiv = useRef<HTMLDivElement>(null);

  return (
    <div
      className="text-2xl overlay start"
      data-testid="start-menu"
      ref={masterDiv}
    >
      <div>
        <p>Start</p>
        <button
          onClick={() => {
            mouseClick();
            if (masterDiv.current) {
              masterDiv.current.classList.add("leaving");
            }
            setTimeout(() => setGame({ state: "running" }), 280);
          }}
          className="text-lg"
          data-testid="start-menu-button"
        >
          Play
        </button>
      </div>
    </div>
  );
}
