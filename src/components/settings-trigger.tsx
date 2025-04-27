import { useEffect, useState } from "react";
import Settings from "./menus/settings";
import Game from "@/types/game";
import Clickable from "./clickable";
import useGame from "@/stores/game";

export default function SettingsTrigger() {
  const [hovered, setHovered] = useState(false);
  const [settings, setSettings] = useState(false);
  const [oldState, setOldState] = useState<null | Game["state"]>(null);
  const getGame = useGame((state) => state.getGame);
  const setGame = useGame((state) => state.setGame);

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
      <Clickable
        as="p"
        style={{ ...effect, zIndex: 100 }}
        onMouseEnter={handle}
        onClick={() => {
          const oldState = getGame().state;
          setOldState(oldState);
          if (oldState == "running") setGame({ state: "settings" });
          setSettings(true);
        }}
        className="settings-trigger"
      >
        <img src="/svgs/gear.svg" />
      </Clickable>
      {settings && <Settings stater={setSettings} oldState={oldState!} />}
    </>
  );
}
