import * as React from "react";
import { useSpring, animated } from "react-spring";

interface CountDownProps {
  countDown: number;
  onRest: () => void;
}

export function CountDown({ countDown, onRest }: CountDownProps) {
  const props = useSpring({
    onRest,
    number: 0,
    from: {
      number: countDown / 1000,
    },
    config: {
      duration: countDown,
      precision: 1,
    },
  });

  return (
    <animated.span>
      {props.number.interpolate((number) => Math.round(number))}
    </animated.span>
  );
}
