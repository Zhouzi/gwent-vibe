import { createGlobalStyle } from "styled-components";
import { themeCSSVariablesDeclarations } from "design/theme";
import bg from "design/assets/bg-1440.jpg";
import "modern-normalize/modern-normalize.css";

export const GlobalStyle = createGlobalStyle`
  :root {
    ${themeCSSVariablesDeclarations}
  }

  html {
    font-size: 16px;
    background-image: url(${bg});
    background-size: cover;
    background-color: ${(props) => props.theme.colors.background.main};
  }

  body {
    font-family: 'Source Sans Pro', sans-serif;
    font-size: 1rem;
    line-height: 1.5;
    color: ${(props) => props.theme.colors.text.main};
  }
`;
