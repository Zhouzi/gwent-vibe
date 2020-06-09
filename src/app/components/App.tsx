import * as React from "react";
import styled, { ThemeProvider, css } from "styled-components";
import { useSpring, animated } from "react-spring";
import { themeCSSVariables } from "design/theme";
import { GlobalStyle, FireSparks, Container } from "design/components";
import button from "design/assets/button@2x.png";

const Image = styled(animated.img)`
  max-width: 80%;
  height: auto;
`;

const Toolbar = styled.aside`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 1rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const unstyled = css`
  font: inherit;
  color: inherit;
  border: none;
  background: transparent;
  text-decoration: none;
  padding: 0;
  margin: 0;
`;

const ToolbarButton = styled.button`
  ${unstyled}

  font-family: 'Arvo', sans-serif !important;
  cursor: pointer;

  border-image-source: url(${button});
  border-width: 0 12px 0 12px;
  border-style: solid;
  border-image-slice: 0 12 0 12 fill;
  border-image-outset: 0;
  height: 112px;
  display: inline-flex;
  padding: 0 60px;
  align-items: center;
  justify-content: center;
  margin: 0 auto -12px;
  width: 424px;

  text-transform: uppercase;
  color: #000;
  letter-spacing: -0.6px;
  text-shadow: 1px 1px 1px rgba(255, 255, 255, 0.63),
    0 1px 12px rgba(255, 255, 255, 0.63);
  font-family: HalisGR-Bold, sans-serif;
  font-size: 24px;
  font-weight: 700;
`;

const ToolbarLink = styled.button`
  ${unstyled}

  font-size: 0.8rem;
`;

const ToolbarLabel = styled.label`
  display: block;
  margin-bottom: 1rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const ToolbarInput = styled.input`
  display: block;
  width: 100%;
`;

export function App() {
  const [src, setSrc] = React.useState<string | null>(null);
  const [blur, setBlur] = React.useState(100);
  const [duration, setDuration] = React.useState(15000);
  const [isRevealed, setIsRevealed] = React.useState(false);
  const [isSettingsVisible, setIsSettingsVisible] = React.useState(false);

  const props = useSpring({
    filter: isRevealed ? "blur(0px)" : `blur(${blur}px)`,
    from: { filter: `blur(${blur}px)` },
    config: { duration: isRevealed ? duration : 0 },
  });

  return (
    <ThemeProvider theme={themeCSSVariables}>
      <GlobalStyle />
      <FireSparks />
      <Container>
        {src == null ? (
          <input
            type="file"
            accept="image/*"
            onChange={(event) => {
              const file = event.target.files?.[0];

              if (file == null) {
                return;
              }

              const reader = new FileReader();

              reader.addEventListener("load", (event) => {
                setSrc(event.target!.result as string);
              });

              reader.readAsDataURL(file);
            }}
          />
        ) : (
          <>
            <Image src={src} alt="" style={props} />
            {!isRevealed && (
              <Toolbar>
                <ToolbarLabel as="div">
                  <ToolbarButton
                    type="button"
                    onClick={() => setIsRevealed(true)}
                  >
                    Révéler
                  </ToolbarButton>
                </ToolbarLabel>
                <ToolbarLink
                  type="button"
                  onClick={() =>
                    setIsSettingsVisible(
                      (currentIsSettingsVisible) => !currentIsSettingsVisible
                    )
                  }
                >
                  {isSettingsVisible
                    ? "Masquer les paramètres"
                    : "Afficher les paramètres"}
                </ToolbarLink>
                {isSettingsVisible && (
                  <>
                    <ToolbarLabel>
                      Durée (secondes):
                      <ToolbarInput
                        type="number"
                        value={duration / 1000}
                        onChange={(event) =>
                          setDuration(Number(event.target.value) * 1000)
                        }
                        min="1"
                      />
                    </ToolbarLabel>
                    <ToolbarLabel>
                      Flou:
                      <ToolbarInput
                        type="range"
                        step="1"
                        min="0"
                        max="100"
                        onChange={(event) => {
                          setBlur(Number(event.target.value));
                        }}
                        value={blur}
                      />
                    </ToolbarLabel>
                  </>
                )}
              </Toolbar>
            )}
          </>
        )}
      </Container>
    </ThemeProvider>
  );
}
