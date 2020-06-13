import * as React from "react";
import { Draft } from "immer";
import { SlideEffects } from "app/AppState";
import { Label, InputCheckbox, InputRange } from "design/components";

interface SettingsBlurProps {
  effects: SlideEffects;
  onChange: (updateEffects: (effects: Draft<SlideEffects>) => void) => void;
}

export function SettingsBlur(props: SettingsBlurProps) {
  return (
    <>
      <Label>
        <InputCheckbox
          onChange={() =>
            props.onChange((effects) => {
              effects.blur.enabled = !effects.blur.enabled;
            })
          }
          checked={props.effects.blur.enabled}
        />
        Flou
      </Label>
      {props.effects.blur.enabled && (
        <InputRange
          min="0"
          max="200"
          step="1"
          onChange={(event) => {
            const blur = Number(event.target.value);

            props.onChange((effects) => {
              effects.blur.blur = blur;
            });
          }}
          value={props.effects.blur.blur}
        />
      )}
    </>
  );
}
