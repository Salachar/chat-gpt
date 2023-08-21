import { createSignal, onMount } from 'solid-js'
import { styled } from 'solid-styled-components';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: row;
  background-color: var(--color-dark-blue-70);
  height: 2rem;
  line-height: 2rem;
`;

const StyledLabel = styled.label`
  color: white;
  margin: 0 1rem 0 0.5rem;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.7rem;
  font-weight: 600;
  min-width: 4rem;
`;

const StyledRadioWrap = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: row;
`;

const StyledRadio = styled.div`
  color: white;
  flex-basis: 0;
  flex-grow: 1;
  text-align: center;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.6rem;
  font-weight: 600;
  white-space: nowrap;

  ${({ isSelected }) => isSelected && `
    background-color: var(--color-blue);
  `}
`;

export const Radio = (props) => {
  const init_option = (props.options || [])[0];

  const [getSelectedItem, setSelectedItem] = createSignal(init_option);

  onMount(() => {
    if (props.onChange) props.onChange(init_option);
  });

  return (
    <StyledContainer class={props.class}>
      <StyledLabel>{props.label}</StyledLabel>
      <StyledRadioWrap>
        {(props.options || []).map((option) => {
          return (
            <StyledRadio
              isSelected={option === getSelectedItem()}
              onClick={() => {
                setSelectedItem(option);
                if (props.onChange) {
                  props.onChange(option);
                }
              }}
            >
              {option}
            </StyledRadio>
          );
        })}
      </StyledRadioWrap>
    </StyledContainer>
  );
}
