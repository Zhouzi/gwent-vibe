import * as React from "react";

interface InputFileProps {
  onChange: (image: HTMLImageElement) => void;
}

function read(file: File, signal: AbortSignal): Promise<string> {
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

function load(base64: string, signal: AbortSignal): Promise<HTMLImageElement> {
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

export function InputFile({ onChange }: InputFileProps) {
  const [file, setFile] = React.useState<File | null>(null);
  const ref = React.useRef<typeof onChange>(onChange);

  React.useEffect(() => {
    ref.current = onChange;
  }, [onChange]);

  React.useEffect(() => {
    if (file == null) {
      return;
    }

    const controller = new AbortController();

    read(file, controller.signal)
      .then((base64) => load(base64, controller.signal))
      .then((image) => {
        ref.current(image);
      });

    return () => {
      controller.abort();
    };
  }, [file]);

  return (
    <input
      type="file"
      accept="image/*"
      onChange={(event) => {
        const file = event.target.files?.[0];

        if (file == null) {
          return;
        }

        setFile(file);
      }}
    />
  );
}

export default InputFile;
