import useGame from "@/stores/game";
import Clickable from "../clickable";

export default function PauseMenu() {
  const setGame = useGame((state) => state.setGame);

  return (
    <div className="overlay text-2xl" data-testid="pause-menu">
      <p>Paused</p>
      <Clickable
        onClick={() => {
          setGame({ state: "running" });
        }}
        className="text-lg"
      >
        Continue
      </Clickable>
    </div>
  );
}
