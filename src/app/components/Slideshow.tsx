import * as React from "react";
import styled from "styled-components";
import { FiSkipBack, FiPlay, FiRewind, FiSkipForward } from "react-icons/fi";
import { Draft } from "immer";
import { useImmer } from "use-immer";
import { Slide, Effect } from "app/AppState";
import { applyEffect, getCSSFilter, isAnimation } from "app/operations";
import { InputFileImage } from "./InputFileImage";
import { CountDown } from "./CountDown";
import { ImageAnimated } from "./ImageAnimated";

interface SlideshowProps {
  effect: Effect | null;
  countDown: number | null;
}

interface SlideshowState {
  stage: "initial" | "animating" | "revealed";
  currentSlideIndex: number;
  slides: Slide[];
}

const Container = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  & > *:first-child {
    flex: 1;
  }
`;

const Scene = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Toolbar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const ToolbarPagination = styled.div``;

const ToolbarButtons = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
`;

const ToolbarButtonsItem = styled.li``;

const ButtonIcon = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.4rem;
  height: 2.4rem;
`;

export function Slideshow({ effect, countDown }: SlideshowProps) {
  const [state, updateState] = useImmer<SlideshowState>({
    stage: "initial",
    currentSlideIndex: 0,
    slides: [
      {
        originalImage: null,
        image: null,
      },
    ],
  });
  const currentSlide = state.slides[state.currentSlideIndex];

  React.useEffect(() => {
    updateState((draft) => {
      draft.slides.forEach((slide) => {
        if (slide.originalImage == null) {
          return;
        }

        slide.image = (effect == null
          ? slide.originalImage
          : applyEffect(
              slide.originalImage as HTMLImageElement,
              effect
            )) as Draft<HTMLImageElement>;
      });
    });
  }, [effect, updateState]);

  return (
    <Container>
      <Scene>
        {currentSlide.originalImage == null || currentSlide.image == null ? (
          <InputFileImage
            onChange={(image) => {
              updateState((draft) => {
                draft.slides.forEach((slide, index) => {
                  if (index === state.currentSlideIndex) {
                    slide.originalImage = image as Draft<HTMLImageElement>;
                    slide.image = (effect == null
                      ? image
                      : applyEffect(image, effect)) as Draft<HTMLImageElement>;
                  }
                });
              });
            }}
          />
        ) : state.stage === "animating" ? (
          <>
            {countDown == null ? (
              <img
                src={currentSlide.image.src}
                alt=""
                style={effect == null ? {} : { filter: getCSSFilter(effect) }}
              />
            ) : (
              <>
                {effect == null || !isAnimation(effect) ? (
                  <img
                    src={currentSlide.image.src}
                    alt=""
                    style={
                      effect == null ? {} : { filter: getCSSFilter(effect) }
                    }
                  />
                ) : (
                  <ImageAnimated
                    src={currentSlide.image.src}
                    effect={effect}
                    countDown={countDown}
                  />
                )}
              </>
            )}
          </>
        ) : state.stage === "revealed" ? (
          <img src={currentSlide.originalImage.src} alt="" />
        ) : (
          <img
            src={currentSlide.image.src}
            alt=""
            style={effect == null ? {} : { filter: getCSSFilter(effect) }}
          />
        )}
      </Scene>
      <Toolbar>
        <ToolbarPagination>
          {state.currentSlideIndex + 1}/{state.slides.length}
        </ToolbarPagination>
        <ToolbarButtons>
          <ToolbarButtonsItem>
            <ButtonIcon
              type="button"
              onClick={() => {
                updateState((draft) => {
                  if (draft.currentSlideIndex <= 0) {
                    return;
                  }

                  draft.stage = "initial";
                  draft.currentSlideIndex -= 1;
                });
              }}
            >
              <FiSkipBack />
            </ButtonIcon>
          </ToolbarButtonsItem>
          <ToolbarButtonsItem>
            <ButtonIcon
              type="button"
              onClick={() => {
                updateState((draft) => {
                  if (draft.stage === "initial") {
                    draft.stage = countDown == null ? "revealed" : "animating";
                  } else {
                    draft.stage = "initial";
                  }
                });
              }}
            >
              {state.stage === "initial" && <FiPlay />}
              {state.stage === "animating" && (
                <CountDown
                  countDown={countDown || 0}
                  onRest={() => {
                    updateState((draft) => {
                      draft.stage = "revealed";
                    });
                  }}
                />
              )}
              {state.stage === "revealed" && <FiRewind />}
            </ButtonIcon>
          </ToolbarButtonsItem>
          <ToolbarButtonsItem>
            <ButtonIcon
              type="button"
              onClick={() => {
                updateState((draft) => {
                  draft.currentSlideIndex += 1;
                  draft.stage = "initial";

                  if (draft.currentSlideIndex >= draft.slides.length) {
                    draft.slides.push({
                      originalImage: null,
                      image: null,
                    });
                  }
                });
              }}
            >
              <FiSkipForward />
            </ButtonIcon>
          </ToolbarButtonsItem>
        </ToolbarButtons>
      </Toolbar>
    </Container>
  );
}
