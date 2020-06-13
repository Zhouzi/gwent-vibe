import shortid from "shortid";

export type Status = "initial" | "playing" | "over";

export interface Slide {
  readonly id: string;
  readonly originalImage: HTMLImageElement | null;
  readonly image: HTMLImageElement | null;
  readonly effects: SlideEffects;
  readonly animationDuration: number;
}

export interface SlideEffects {
  readonly blur: {
    readonly enabled: boolean;
    readonly blur: number;
  };
}

export interface AppState {
  readonly expanded: boolean;
  readonly status: Status;
  readonly slides: Slide[];
  readonly currentSlideIndex: number;
}

export function createSlide(): Slide {
  return {
    id: shortid.generate(),
    originalImage: null,
    image: null,
    effects: {
      blur: {
        enabled: false,
        blur: 20,
      },
    },
    animationDuration: 15000,
  };
}

export function toCSSFilter(effects: SlideEffects): string {
  return `blur(${effects.blur.enabled ? effects.blur.blur : 0}px)`;
}
