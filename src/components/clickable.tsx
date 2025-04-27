import useGame from "@/stores/game";
import {
  ComponentPropsWithoutRef,
  ElementType,
  ReactNode,
  useCallback,
} from "react";
import useSound from "use-sound";

type AsProp<C extends ElementType> = {
  as?: C;
};

type ClickableProps<C extends ElementType> = AsProp<C> &
  ComponentPropsWithoutRef<C> & {
    children: ReactNode;
  };

export default function Clickable<C extends ElementType = "button">({
  as,
  children,
  onClick,
  ...props
}: ClickableProps<C>) {
  const volume = useGame((state) => state.game.settings.effectsVolume);
  const [mouseClick] = useSound("/sounds/mouse-click-2.wav", { volume });

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      mouseClick();
      if (onClick) onClick(e);
    },
    [mouseClick, onClick]
  );

  const Component = as || "button";

  return (
    <Component onClick={handleClick} {...props}>
      {children}
    </Component>
  );
}
