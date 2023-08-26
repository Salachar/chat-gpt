import { styled } from 'solid-styled-components';

const StyledName = styled.h1`
  position: relative;
  font-size: 1.5rem;
  margin: 0;
  color: var(--color-orange-spice);
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
