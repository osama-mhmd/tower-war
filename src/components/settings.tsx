import useGame from "@/stores/game";
import { useRef } from "react";

export default function Settings({ stater }: { stater(agr0: boolean): void }) {
  const effectsVolume = useRef<HTMLInputElement>(null);
  const { getGame, setGame } = useGame();

  function save() {
    setGame({
      paused: false,
      settings: { effectsVolume: +effectsVolume.current!.value / 100 },
    });

    stater(false);
  }

  function cancel() {
    setGame({ paused: false });

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
