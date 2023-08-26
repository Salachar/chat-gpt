import { styled } from 'solid-styled-components';

const StyledName = styled.h1`
  position: relative;
  font-size: 1.5rem;
  color: var(--color-orange-spice);
  margin: 0 0 0.5rem 0;
`;

export const Name = (props) => {
  const getName = () => {
    return props?.name || "";
  };

  return (
    <>
      {getName() && (
        <StyledName>{getName()}</StyledName>
      )}
    </>
  );
}
