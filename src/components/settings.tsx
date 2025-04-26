import useGame from "@/stores/game";
import Game from "@/types/game";
import { useRef } from "react";
import useSound from "use-sound";

export default function Settings({
  stater,
  oldState,
}: {
  stater(agr0: boolean): void;
  oldState: Game["state"];
}) {
  const effectsVolume = useRef<HTMLInputElement>(null);
  const { getGame, setGame } = useGame();
  const [play] = useSound("/sounds/mouse-click-2.wav", { volume: 0.4 });

  function save() {
    play();

    setGame({
      state: oldState,
      settings: { effectsVolume: +effectsVolume.current!.value / 100 },
    });

    stater(false);
  }

  function cancel() {
    play();

    setGame({ state: oldState });

    stater(false);
  }

  return (
    <div className="overlay settings">
      <div>
        {/* Header */}
        <h2>Settings</h2>
        {/* Content */}
        <div>
          <div className="field">
            Effects Volume:{" "}
            <input
              type="range"
              min={0}
              max={100}
              defaultValue={(getGame().settings?.effectsVolume ?? 0) * 100}
              ref={effectsVolume}
            />
          </div>
        </div>
        {/* Footer */}
        <div>
          <button onClick={cancel}>Cancel</button>
          <button onClick={save}>Save</button>
        </div>
      </div>
    </div>
  );
}
