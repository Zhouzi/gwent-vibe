import { Effect } from "app/AppState";

type Rgba = [number, number, number, number];

type Pixel = [number, number, Rgba];

type PixelRange = Pixel[][];

export function pixelate(
  originalImage: HTMLImageElement,
  size: number
): HTMLImageElement {
  const canvas = window.document.createElement("canvas");
  canvas.width = originalImage.naturalWidth;
  canvas.height = originalImage.naturalHeight;

  const context = canvas.getContext("2d")!;
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

  forEach(originalImage, size, (range) => {
    const [r, g, b, a] = average(range);

    range.forEach((row) => {
      row.forEach(([x, y]) => {
        const index = (y * canvas.width + x) * 4;

        imageData.data[index] = r;
        imageData.data[index + 1] = g;
        imageData.data[index + 2] = b;
        imageData.data[index + 3] = 255 * a;
      });
    });
  });

  context.putImageData(imageData, 0, 0);

  const base64 = canvas.toDataURL();
  const image = window.document.createElement("img");
  image.src = base64;

  return image;
}

function average(range: PixelRange): Rgba {
  const { r, g, b } = range.reduce(
    (acc, row) =>
      row.reduce(
        (acc, [x, y, [r, g, b]]) => ({
          r: acc.r + r,
          g: acc.g + g,
          b: acc.b + b,
        }),
        acc
      ),
    { r: 0, g: 0, b: 0 }
  );
  return [r, g, b]
    .map((color) => ~~(color / (range[0].length * range.length)))
    .concat(1) as Rgba;
}

function forEach(
  image: HTMLImageElement,
  range: number,
  callback: (range: PixelRange) => void
) {
  const canvas = window.document.createElement("canvas");

  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;

  const context = canvas.getContext("2d")!;
  context.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);

  const imageData = context.getImageData(
    0,
    0,
    image.naturalWidth,
    image.naturalHeight
  ).data;

  for (let y = 0; y < image.naturalHeight; y += range) {
    for (let x = 0; x < image.naturalWidth; x += range) {
      callback(
        Array.from({
          length: Math.min(range, image.naturalHeight - y),
        }).map((_, rangeY) =>
          Array.from({
            length: Math.min(range, image.naturalWidth - x),
          }).map((_, rangeX) => {
            const realX = rangeX + x;
            const realY = rangeY + y;
            const index = (realY * image.naturalWidth + realX) * 4;
            const rgba: Rgba = [
              imageData[index],
              imageData[index + 1],
              imageData[index + 2],
              Math.round((imageData[index + 3] / 255) * 10) / 10,
            ];

            return [realX, realY, rgba];
          })
        )
      );
    }
  }
}

export function read(file: File, signal: AbortSignal): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    const onAbort = () => {
      reader.removeEventListener("load", onLoad);
      reject();
    };
    const onLoad = (event: ProgressEvent<FileReader>) => {
      signal.removeEventListener("abort", onAbort);
      resolve(event.target!.result as string);
    };

    reader.addEventListener("load", onLoad);
    signal.addEventListener("abort", onAbort);

    reader.readAsDataURL(file);
  });
}

export function load(
  base64: string,
  signal: AbortSignal
): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = window.document.createElement("img");
    const onAbort = () => {
      image.removeEventListener("load", onLoad);
      reject();
    };
    const onLoad = () => {
      signal.removeEventListener("abort", onAbort);
      resolve(image);
    };

    image.addEventListener("load", onLoad);
    signal.addEventListener("abort", onAbort);

    image.src = base64;
  });
}

export function applyEffect(
  image: HTMLImageElement,
  effect: Effect
): HTMLImageElement {
  switch (effect.type) {
    case "pixelate":
      return pixelate(image, effect.pixelate);
    default:
      return image;
  }
}

export function getInitialCSSFilter(effect: Effect): string {
  switch (effect.type) {
    case "blur":
      return getCSSFilter({
        ...effect,
        blur: 0,
      });
    default:
      return "none";
  }
}

export function getCSSFilter(effect: Effect): string {
  switch (effect.type) {
    case "blur":
      return `blur(${effect.blur}px)`;
    default:
      return "none";
  }
}

export function isAnimation(effect: Effect) {
  return effect.type === "blur";
}
