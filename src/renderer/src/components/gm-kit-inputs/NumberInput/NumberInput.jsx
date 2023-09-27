import { createSignal } from 'solid-js'
import { handleStore, getDecimalCount } from '@utils';

import {
 StyledContainer,
 StyledLabel,
 StyledInputs,
 StyledArrowButton,
 StyledInfo,
 StyledInput,
} from "./NumberInput.styled";

export const NumberInput = (props) => {
  const [value, setValue] = createSignal(props.defaultValue || 0);
  const [timer, setTimer] = createSignal(null);

  const stopTimer = () => {
    clearInterval(timer());
    setTimer(null);
  }

  const fireInput = (mod = 0) => {
    mod = mod * props.step || 1;
    checkValue({
      value: value(),
      mod,
      set: true,
    });
    setTimer(setInterval(() => {
      checkValue({
        value: value(),
        mod,
        set: true,
      });
    }, props.interval || 100));
  }

  const checkValue = ({ value = 0, mod = 0, set = false }) => {
    value = parseFloat(value) || 0;
    value += mod;

    if (typeof props.min === 'number' && value < props.min) value = props.min;
    if (typeof props.min === 'number' && value > props.max) value = props.max;

    if (set) {
      setValue(value.toFixed(getDecimalCount(props.step || 1)));
    }

    handleStore({
      store_key: props.storeKey,
      store_event: props.storeEvent,
    }, value);
  }

  return (
    <StyledContainer class={props.class} inline={props.inline}>
      <StyledLabel inline={props.inline}>{props.label}</StyledLabel>
      <StyledInputs inline={props.inline}>
        <StyledArrowButton left
          onMouseDown={() => {
            fireInput(-1);
          }}
          onMouseUp={() => {
            stopTimer();
          }}
        />
        {!isNaN(props.min) && <StyledInfo min />}
        <StyledInput
          value={value()}
          onKeyUp={(e) => {
            checkValue({
              value: e.currentTarget.value,
            });
          }}
        />
        {!isNaN(props.max) && <StyledInfo max />}
        <StyledArrowButton right
          onMouseDown={() => {
            fireInput(1);
          }}
          onMouseUp={() => {
            stopTimer();
          }}
        />
      </StyledInputs>
    </StyledContainer>
  )
}
