import * as React from "react";
import { Draft } from "immer";
import { useImmer } from "use-immer";
import styled, { ThemeProvider } from "styled-components";
import {
  FiSettings,
  FiPlay,
  FiSquare,
  FiSkipForward,
  FiSkipBack,
  FiRewind,
} from "react-icons/fi";
import { themeCSSVariables } from "design/theme";
import {
  GlobalStyle,
  FireSparks,
  IconButton,
  Caption,
  FormGroup,
  Input,
} from "design/components";
import { AppState, createSlide, Slide } from "app/AppState";
import { Scene } from "./Scene";
import { InputFile } from "./InputFile";
import { SettingsBlur } from "./SettingsBlur";

const Container = styled.main`
  display: flex;
  min-height: 100vh;

  & > *:first-child {
    flex: 1;
  }

  & > *:last-child {
    position: relative;
    z-index: 1;
  }
`;

const Toolbar = styled.aside`
  display: flex;
  background-color: rgba(0, 0, 0, 0.25);
`;

const ToolbarButtons = styled.ul`
  padding: 0;
  margin: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
`;

const ToolbarButtonsItem = styled.li``;

const ToolbarButtonsPagination = styled(Caption).attrs({ as: "li" })`
  flex: 1;
  display: flex;
  align-items: flex-end;
  justify-content: center;
`;

const ToolbarSettings = styled.div`
  position: relative;
  padding: 1rem;
  min-width: 14rem;
`;

export function App() {
  const [state, updateState] = useImmer<AppState>({
    expanded: false,
    status: "initial",
    slides: [createSlide()],
    currentSlideIndex: 0,
  });
  const currentSlide = state.slides[state.currentSlideIndex];

  const onChangeImage = React.useCallback(
    (image: HTMLImageElement) => {
      updateState((draft) => {
        draft.slides.forEach((slide) => {
          if (slide.id === currentSlide.id) {
            slide.originalImage = image as Draft<HTMLImageElement>;
            slide.image = image as Draft<HTMLImageElement>;
          }
        });
      });
    },
    [currentSlide.id, updateState]
  );

  return (
    <ThemeProvider theme={themeCSSVariables}>
      <GlobalStyle />
      <FireSparks />
      <Container>
        <Scene
          status={state.status}
          slide={currentSlide}
          onOver={() => {
            updateState((draft) => {
              draft.status = "over";
            });
          }}
        />
        <Toolbar>
          <ToolbarButtons>
            <ToolbarButtonsItem>
              <IconButton
                onClick={() => {
                  updateState((draft) => {
                    draft.expanded = !draft.expanded;
                  });
                }}
                disabled={state.status !== "initial"}
              >
                <FiSettings />
              </IconButton>
            </ToolbarButtonsItem>
            <ToolbarButtonsItem>
              <IconButton
                onClick={() => {
                  updateState((draft) => {
                    draft.status =
                      draft.status === "initial" ? "playing" : "initial";

                    if (draft.status !== "initial") {
                      draft.expanded = false;
                    }
                  });
                }}
                disabled={
                  currentSlide.originalImage == null ||
                  currentSlide.image == null
                }
              >
                {state.status === "playing" && <FiSquare />}
                {state.status === "over" && <FiRewind />}
                {state.status === "initial" && <FiPlay />}
              </IconButton>
            </ToolbarButtonsItem>
            <ToolbarButtonsItem>
              <IconButton
                onClick={() => {
                  updateState((draft) => {
                    if (draft.currentSlideIndex <= 0) {
                      return;
                    }

                    draft.status = "initial";
                    draft.currentSlideIndex -= 1;
                  });
                }}
                disabled={state.currentSlideIndex <= 0}
              >
                <FiSkipBack />
              </IconButton>
            </ToolbarButtonsItem>
            <ToolbarButtonsItem>
              <IconButton
                onClick={() => {
                  updateState((draft) => {
                    draft.status = "initial";
                    draft.currentSlideIndex += 1;

                    if (draft.currentSlideIndex >= draft.slides.length) {
                      draft.slides.push(createSlide() as Draft<Slide>);
                    }
                  });
                }}
              >
                <FiSkipForward />
              </IconButton>
            </ToolbarButtonsItem>
            <ToolbarButtonsPagination>
              {state.currentSlideIndex + 1}/{state.slides.length}
            </ToolbarButtonsPagination>
          </ToolbarButtons>
          {state.expanded && (
            <ToolbarSettings>
              <FormGroup>
                <Caption>Image</Caption>
                <InputFile onChange={onChangeImage} />
              </FormGroup>
              <FormGroup>
                <Caption>Effets</Caption>
                <SettingsBlur
                  effects={currentSlide.effects}
                  onChange={(updateEffects) => {
                    updateState((draft) => {
                      draft.slides.forEach((slide) => {
                        if (slide.id === currentSlide.id) {
                          updateEffects(slide.effects);
                        }
                      });
                    });
                  }}
                />
              </FormGroup>
              <FormGroup>
                <Caption>Durée de l'animation (secondes)</Caption>
                <Input
                  type="number"
                  onChange={(event) => {
                    const animationDuration = Number(event.target.value) * 1000;

                    updateState((draft) => {
                      draft.slides.forEach((slide) => {
                        if (slide.id === currentSlide.id) {
                          slide.animationDuration = animationDuration;
                        }
                      });
                    });
                  }}
                  value={currentSlide.animationDuration / 1000}
                  min="0"
                  max="60"
                />
              </FormGroup>
            </ToolbarSettings>
          )}
        </Toolbar>
      </Container>
    </ThemeProvider>
  );
}
