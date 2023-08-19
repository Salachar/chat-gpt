import { styled } from 'solid-styled-components';

const StyledFlavorTextWrapper = styled.div`
  background-color: var(--color-dark-blue);
  border-left: 2px solid var(--color-orange-spice);
  padding: 1rem;
  margin-top: 0.5rem;
`;

const StyledFlavorText = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;

  &:first-child {
    margin-top: 0;
  }
  &:last-child {
    margin-bottom: 0;
  }
`;

export const RoomFlavorText = (props) => {
  const getFlavorText = () => {
    return props?.room?.data?.flavor_text || null;
  };

  return (
    <>
      {getFlavorText() && (
        <StyledFlavorTextWrapper>
          {getFlavorText().map((text) => (
            <StyledFlavorText>{text}</StyledFlavorText>
          ))}
        </StyledFlavorTextWrapper>
      )}
    </>
  );
}
