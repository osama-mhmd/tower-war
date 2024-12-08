import { HTMLAttributes, useEffect, useState } from "react";
import Settings from "./settings";

export default function SettingsTrigger({
  style,
  onClick,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  const [hovered, setHovered] = useState(false);
  const [settings, setSettings] = useState(false);

  const effect = {
    marginBottom: "0.5rem",
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
        style={{ ...effect, ...style }}
        onMouseEnter={handle}
        onClick={(e) => {
          onClick!(e);
          setSettings(true);
        }}
        className="settings-trigger"
        {...props}
      >
        <img src="/svgs/gear.svg" />
      </p>
      {settings && <Settings stater={setSettings} />}
    </>
  );
}
