export interface Slide {
  originalImage: HTMLImageElement | null;
  image: HTMLImageElement | null;
}

export type Effect =
  | {
      type: "blur";
      blur: number;
    }
  | {
      type: "pixelate";
      pixelate: number;
    };
