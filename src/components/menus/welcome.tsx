import { useRef } from "react";
import Clickable from "../clickable";
import useGame from "@/stores/game";

export default function WelcomeMenu() {
  const masterDiv = useRef<HTMLDivElement>(null);
  const setGame = useGame((state) => state.setGame);

  return (
    <div
      className="text-2xl overlay start"
      data-testid="start-menu"
      ref={masterDiv}
    >
      <div>
        <p>Start</p>
        <Clickable
          onClick={() => {
            if (masterDiv.current) {
              masterDiv.current.classList.add("leaving");
            }
            setTimeout(() => setGame({ state: "running" }), 280);
          }}
          className="text-lg"
          data-testid="start-menu-button"
        >
          Play
        </Clickable>
      </div>
    </div>
  );
}
