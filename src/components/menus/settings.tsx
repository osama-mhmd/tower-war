import useGame from "@/stores/game";
import Game from "@/types/game";
import { useRef } from "react";
import Clickable from "../clickable";

export default function Settings({
  stater,
  oldState,
}: {
  stater(agr0: boolean): void;
  oldState: Game["state"];
}) {
  const effectsVolume = useRef<HTMLInputElement>(null);
  const getGame = useGame((state) => state.getGame);
  const setGame = useGame((state) => state.setGame);

  function save() {
    setGame({
      state: oldState,
      settings: { effectsVolume: +effectsVolume.current!.value / 100 },
    });

    stater(false);
  }

  function cancel() {
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
          <Clickable onClick={cancel}>Cancel</Clickable>
          <Clickable onClick={save}>Save</Clickable>
        </div>
      </div>
    </div>
  );
}
