import * as React from "react";
import { useSpring, animated } from "react-spring";
import { Slide, toCSSFilter, createSlide } from "app/AppState";

interface ImageAnimatedProps {
  slide: Slide;
  onOver: () => void;
}

export function ImageAnimated({ slide, onOver }: ImageAnimatedProps) {
  const style = useSpring({
    onRest: onOver,
    filter: toCSSFilter(createSlide().effects),
    from: {
      filter: toCSSFilter(slide.effects),
    },
    config: {
      duration: slide.animationDuration,
    },
  });

  return <animated.img src={slide.image!.src} alt="" style={style} />;
}
