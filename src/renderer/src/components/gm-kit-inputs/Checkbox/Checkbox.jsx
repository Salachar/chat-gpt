import { createSignal } from 'solid-js'
import { handleStore } from "@utils";
import {
  StyledContainer,
  StyledCheckbox,
  StyledLabel,
} from "./Checkbox.styled";

export const Checkbox = (props) => {
  const [isChecked, setIsChecked] = createSignal(props.checked || false);

  return (
    <StyledContainer title={props.hint} class={props.class}>
      <StyledCheckbox
        checked={isChecked()}
        onClick={(e) => {
          const new_checked = !isChecked();
          setIsChecked(new_checked);
          if (props.onChange) {
            props.onChange(new_checked);
          }
          handleStore({
            store_key: props.storeKey,
            store_event: props.storeEvent,
          }, new_checked);
        }}
      />
      <StyledLabel>{props.label}</StyledLabel>
    </StyledContainer>
  )
}

module.exports = Checkbox;
