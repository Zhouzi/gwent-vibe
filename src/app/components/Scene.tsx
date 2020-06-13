import * as React from "react";
import styled from "styled-components";
import { Slide, Status, toCSSFilter } from "app/AppState";
import { ImageAnimated } from "./ImageAnimated";

const Container = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface SceneProps {
  status: Status;
  slide: Slide;
  onOver: () => void;
}

export function Scene({ status, slide, onOver }: SceneProps) {
  return (
    <Container>
      {slide.originalImage && slide.image && (
        <>
          {status === "initial" && (
            <img
              src={slide.image.src}
              alt=""
              style={{ filter: toCSSFilter(slide.effects) }}
            />
          )}
          {status === "playing" && (
            <ImageAnimated slide={slide} onOver={onOver} />
          )}
          {status === "over" && <img src={slide.originalImage.src} alt="" />}
        </>
      )}
    </Container>
  );
}
