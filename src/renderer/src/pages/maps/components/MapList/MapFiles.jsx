import { Show, createSignal, onMount } from 'solid-js'
import { styled } from 'solid-styled-components';

const StyledContainer = styled.div`
  cursor: pointer;
`;

const StyledMapIndicator = styled.span`
  position: relative;
  height: 1.5em;
  width: 1.25em;
  display: inline-block;
  vertical-align: top;
  box-sizing: border-box;
  text-align: center;
  font-weight: bold;
  opacity: 0.2;

  ${({ lit }) => lit && `
    opacity: 1;
  `}
`;

const StyledName = styled.span`
  margin-left: 0.5rem;
  opacity: 0.75;
`;

const StyledVariantsWrapper = styled.div`
  padding-left: 3.5rem;
`;

const StyledVariant = styled.span`
  margin: 0.25rem 0.75rem 0.5rem 0rem;
  display: inline-block;
  font-size: 0.65rem;
  opacity: 0.75;
  font-weight: bold;
  color: var(--color-orange-spice);

  &:hover {
    opacity: 1;
  }
`;

export const MapFiles = (props) => {
  return (
    <>
      {Object.keys(props.files || {}).map((fileName) => {
        const file = props.files[fileName];
        return (
          <StyledContainer>
            <div
              onMouseEnter={(e) => {
                props.onFileHover(file);
              }}
              onClick={(e) => {
                if (e.defaultPrevented) return;
                props.onFileClick(file);
              }}
            >
              <StyledMapIndicator lit={file.json_exists}>W</StyledMapIndicator>
              <StyledMapIndicator lit={file.dm_version}>D</StyledMapIndicator>
              <StyledMapIndicator lit={file.video}>V</StyledMapIndicator>
              <StyledName>{file.name}</StyledName>
            </div>

            <Show when={file.variants}>
              <StyledVariantsWrapper>
                {Object.keys(file.variants).map((variantName) => {
                  const variant = file.variants[variantName];
                  return (
                    <StyledVariant
                      onMouseEnter={(e) => {
                        props.onFileHover(variant);
                      }}
                      onClick={(e) => {
                        if (e.defaultPrevented) return;
                        props.onFileClick(variant);
                      }}
                    >
                      {variantName}
                    </StyledVariant>
                  )
                })}
              </StyledVariantsWrapper>
            </Show>
          </StyledContainer>
        );
      })}
    </>
  );
};
