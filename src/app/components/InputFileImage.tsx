import * as React from "react";
import { read, load } from "app/operations";

interface InputFileImageProps {
  onChange: (image: HTMLImageElement) => void;
}

export function InputFileImage({ onChange }: InputFileImageProps) {
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
