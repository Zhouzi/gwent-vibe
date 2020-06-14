import * as React from "react";
import styled, { ThemeProvider, css } from "styled-components";
import { themeCSSVariables } from "design/theme";
import { GlobalStyle, FireSparks } from "design/components";
import { Effect } from "app/AppState";
import { load, applyEffect, getCSSFilter } from "app/operations";
import shupe from "app/assets/shupe.jpg";
import { Slideshow } from "./Slideshow";

interface AppState {
  effect: Effect | null;
  countDown: number | null;
  submitted: boolean;
}

const Container = styled.main`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  position: relative;
  z-index: 1;
`;

const Panel = styled.section`
  max-width: 40rem;
  width: 100%;
  padding: 1.4rem;
  background-color: rgba(0, 0, 0, 0.8);
  border-radius: 4px;
`;

const Heading = styled.h1`
  font-family: Arvo, serif;
  font-size: 2.4rem;
  line-height: 1.2;
  margin: 0 0 1rem 0;
`;

const Paragraph = styled.p`
  margin: 0 0 0.4rem 0;
`;

const Settings = styled.div`
  display: flex;
  padding: 1rem 0;
`;

const SettingsPreview = styled.div``;

const SettingsControls = styled.div`
  flex: 1;
  padding-left: 1rem;
`;

const Label = styled.label`
  display: block;
  width: 100%;
  cursor: inherit;

  & > input {
    margin-right: 0.4rem;
  }
`;

interface FormGroupProps {
  active?: boolean;
}

const FormGroup = styled.div<FormGroupProps>`
  cursor: pointer;
  padding: 0.4rem;
  background-color: rgba(255, 255, 255, 0.05);
  margin-bottom: 1px;

  & > input {
    width: 100%;
  }

  &:focus,
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  ${(props) =>
    props.active &&
    css`
      cursor: auto;
      background-color: rgba(255, 255, 255, 0.1);
    `}
`;

const ControlsGroup = styled.div`
  margin-bottom: 1rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Caption = styled.div`
  font-size: 0.8rem;
  letter-spacing: 0.05rem;
  text-transform: uppercase;
  font-weight: bold;
  margin-bottom: 0.4rem;
`;

export function App() {
  const [
    originalImage,
    setOriginalImage,
  ] = React.useState<HTMLImageElement | null>(null);
  const [image, setImage] = React.useState<HTMLImageElement | null>(null);
  const [state, setState] = React.useState<AppState>({
    effect: {
      type: "blur",
      blur: 20,
    },
    countDown: 20000,
    submitted: false,
  });

  React.useEffect(() => {
    const controller = new AbortController();

    load(shupe, controller.signal).then((image) => setOriginalImage(image));

    return () => {
      controller.abort();
    };
  }, []);

  React.useEffect(() => {
    if (originalImage == null) {
      return;
    }

    if (state.effect == null) {
      setImage(originalImage);
    } else {
      setImage(applyEffect(originalImage, state.effect));
    }
  }, [originalImage, state.effect]);

  return (
    <ThemeProvider theme={themeCSSVariables}>
      <GlobalStyle />
      <FireSparks />
      {image == null ? null : state.submitted ? (
        <Slideshow effect={state.effect} countDown={state.countDown} />
      ) : (
        <Container>
          <Panel>
            <Heading>Gwent Vibe</Heading>
            <Paragraph>
              Cette application permet de présenter du contenu image avec une
              ambiance Gwent sous la forme d'un diaporama.
            </Paragraph>
            <Paragraph>
              Chaque diapositive est composée d'une image, à laquelle il est
              possible d'appliquer un effet. Il est également possible de
              configurer un compteur pour que l'image soit affichée au bout de
              quelques secondes.
            </Paragraph>
            <Paragraph>
              Idéal pour teaser une carte, des quizs, et autres mini jeux.
            </Paragraph>
            <form
              onSubmit={(event) => {
                event.preventDefault();

                setState((currentState) => ({
                  ...currentState,
                  submitted: true,
                }));
              }}
            >
              <Settings>
                <SettingsPreview>
                  <Caption>Prévisualisation</Caption>
                  <img
                    src={image.src}
                    alt=""
                    style={
                      state.effect
                        ? {
                            filter: getCSSFilter(state.effect),
                          }
                        : {}
                    }
                  />
                </SettingsPreview>
                <SettingsControls>
                  <ControlsGroup>
                    <Caption>Effets</Caption>
                    <FormGroup active={state.effect?.type === "blur"}>
                      <Label>
                        <input
                          type="radio"
                          name="effect"
                          onChange={() =>
                            setState((currentState) => ({
                              ...currentState,
                              effect: {
                                type: "blur",
                                blur: 20,
                              },
                            }))
                          }
                          checked={state.effect?.type === "blur"}
                        />{" "}
                        Flou
                      </Label>
                      {state.effect?.type === "blur" && (
                        <input
                          type="range"
                          min="0"
                          max="200"
                          step="1"
                          onChange={(event) => {
                            const blur = Number(event.target.value);
                            setState((currentState) => ({
                              ...currentState,
                              effect: {
                                type: "blur",
                                blur,
                              },
                            }));
                          }}
                          value={state.effect.blur}
                        />
                      )}
                    </FormGroup>
                    <FormGroup active={state.effect?.type === "pixelate"}>
                      <Label>
                        <input
                          type="radio"
                          name="effect"
                          onChange={() =>
                            setState((currentState) => ({
                              ...currentState,
                              effect: {
                                type: "pixelate",
                                pixelate: 4,
                              },
                            }))
                          }
                          checked={state.effect?.type === "pixelate"}
                        />{" "}
                        Pixelisation
                      </Label>
                      {state.effect?.type === "pixelate" && (
                        <input
                          type="range"
                          min="1"
                          max="40"
                          step="1"
                          onChange={(event) => {
                            const pixelate = Number(event.target.value);
                            setState((currentState) => ({
                              ...currentState,
                              effect: {
                                type: "pixelate",
                                pixelate,
                              },
                            }));
                          }}
                          value={state.effect.pixelate}
                        />
                      )}
                    </FormGroup>
                    <FormGroup active={state.effect == null}>
                      <Label>
                        <input
                          type="radio"
                          name="effect"
                          onChange={() =>
                            setState((currentState) => ({
                              ...currentState,
                              effect: null,
                            }))
                          }
                          checked={state.effect == null}
                        />{" "}
                        Pas d'effets
                      </Label>
                    </FormGroup>
                  </ControlsGroup>

                  <ControlsGroup>
                    <Caption>Compteur</Caption>
                    <FormGroup active={state.countDown != null}>
                      <Label>
                        <input
                          type="radio"
                          name="countDown"
                          onChange={() =>
                            setState((currentState) => ({
                              ...currentState,
                              countDown: 20000,
                            }))
                          }
                          checked={state.countDown != null}
                        />
                        Afficher l'image originale au bout de quelques secondes
                      </Label>
                      {state.countDown != null && (
                        <input
                          type="number"
                          min="1"
                          onChange={(event) => {
                            const countDown = Number(event.target.value) * 1000;
                            setState((currentState) => ({
                              ...currentState,
                              countDown,
                            }));
                          }}
                          value={state.countDown / 1000}
                        />
                      )}
                    </FormGroup>
                    <FormGroup active={state.countDown == null}>
                      <Label>
                        <input
                          type="radio"
                          name="countDown"
                          onChange={() =>
                            setState((currentState) => ({
                              ...currentState,
                              countDown: null,
                            }))
                          }
                          checked={state.countDown == null}
                        />
                        Afficher l'image originale quand je le souhaiterai
                      </Label>
                    </FormGroup>
                  </ControlsGroup>
                  <button type="submit">Commencer</button>
                </SettingsControls>
              </Settings>
            </form>
          </Panel>
        </Container>
      )}
    </ThemeProvider>
  );
}
