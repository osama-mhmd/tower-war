import { animated, useSpring } from "@react-spring/web";

export default function Start() {
  const animate = useSpring({
    from: {
      transform: "translateX(-10px) rotateZ(180deg)",
    },
    to: {
      transform: "translateX(-1px) rotateZ(0deg)",
    },
    config: {
      tension: 200,
      velocity: -0.2,
      bounce: 2,
    },
  });
  const animate2 = useSpring({
    from: {
      transform: "translateX(10px) rotateZ(90deg)",
    },
    to: {
      transform: "translateX(0px) rotateZ(-90deg)",
    },
    config: {
      tension: 200,
      velocity: -0.2,
      bounce: 2,
    },
  });

  return (
    <div className="overlay">
      <div
        style={{
          position: "absolute",
        }}
      >
        <Svg style={animate} />
        <Svg style={animate2} />
      </div>
    </div>
  );
}

function Svg({ style }: { style: any }) {
  return (
    <animated.svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      style={{
        position: "absolute",
        scale: 8,
        ...style,
      }}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="m2.75 9.25l1.5 2.5l2 1.5m-4.5 0l1 1m1.5-2.5l-1.5 1.5m3-1l8.5-8.5v-2h-2l-8.5 8.5"
      />
    </animated.svg>
  );
}
