import { HTMLAttributes, useEffect, useState } from "react";
import Settings from "./settings";
import Game from "@/types/game";

interface SettingsTriggerProps {
  mouseClick: () => void;
  getGame: () => Game;
  setGame(game: Partial<Game>): void;
}

export default function SettingsTrigger({
  style,
  mouseClick,
  getGame,
  setGame,
  ...props
}: HTMLAttributes<HTMLParagraphElement> & SettingsTriggerProps) {
  const [hovered, setHovered] = useState(false);
  const [settings, setSettings] = useState(false);
  const [oldState, setOldState] = useState<null | Game["state"]>(null);

  const effect = {
    transform: hovered ? "rotateZ(45deg)" : "rotateZ(0)",
    transition: "300ms all",
    cursor: "pointer",
  };

  useEffect(() => {
    if (!hovered) return;

    const timeout = setTimeout(() => setHovered(false), 200);

    return () => clearTimeout(timeout);
  }, [hovered]);

  const handle = () => {
    setHovered(true);
  };

  return (
    <>
      <p
        style={{ ...effect, ...style, zIndex: 100 }}
        onMouseEnter={handle}
        onClick={() => {
          mouseClick();
          const oldState = getGame().state;
          setOldState(oldState);
          if (oldState == "running") setGame({ state: "settings" });
          setSettings(true);
        }}
        className="settings-trigger"
        {...props}
      >
        <img src="/svgs/gear.svg" />
      </p>
      {settings && <Settings stater={setSettings} oldState={oldState!} />}
    </>
  );
}
