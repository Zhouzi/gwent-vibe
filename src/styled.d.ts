import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      text: {
        main: string;
      };
      background: {
        main: string;
      };
    };
  }
}
