import * as React from "react";
import { useSpring, animated } from "react-spring";
import { Effect } from "app/AppState";
import { getInitialCSSFilter, getCSSFilter } from "app/operations";

interface ImageAnimatedProps {
  src: string;
  effect: Effect;
  countDown: number;
}

export function ImageAnimated({ src, effect, countDown }: ImageAnimatedProps) {
  const style = useSpring({
    filter: getInitialCSSFilter(effect),
    from: {
      filter: getCSSFilter(effect),
    },
    config: {
      duration: countDown,
    },
  });
  return <animated.img src={src} alt="" style={style} />;
}
