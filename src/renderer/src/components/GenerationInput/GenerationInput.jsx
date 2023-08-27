import { Index } from 'solid-js'
import { styled } from 'solid-styled-components';
import { Radio } from '@inputs';
import { TextArea } from '@inputs';
import { ActionsContainer } from '@components/Actions';

const StyledTextArea = styled(TextArea)`
  width: 100%;
  height: 100%;

  ${({ size }) => size === 'small' && `
    height: 2.25rem;
    resize: none;
  `}

  ${({ size }) => size === 'large' && `
    height: 3.5rem;
  `}
`;

export const GenerationInput = (props) => {
  return (
    <div class={props.class}>
      <Index each={props.schema().inputs}>
        {(item) => {
          if (item().type === "text") {
            return (
              <ActionsContainer
                label={item().label}
                actions={item().actions}
              >
                <StyledTextArea
                  value={item().value}
                  placeholder={item().placeholder}
                  size={item().size}
                  onChange={item().onChange}
                />
              </ActionsContainer>
            );
          }
          if (item().type === "radio") {
            return (
              <Radio
                label={item().label}
                options={item().options}
                onChange={item().onChange}
              />
            );
          }
        }}
      </Index>
    </div>
  );
}

