import { styled } from 'solid-styled-components';

const StyledName = styled.h1`
  position: relative;
  font-size: 1.5rem;
  margin: 0;
  color: var(--color-orange-spice);
`;

export const RoomName = (props) => {
  const getName = () => {
    return props?.room?.data?.name || "";
  };

  return (
    <>
      {getName() && (
        <StyledName>{getName()}</StyledName>
      )}
    </>
  );
}
