import { createEffect, createSignal, For } from 'solid-js'
import { styled } from 'solid-styled-components';

const StyledContainer = styled.div`
  position: relative;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 0.68fr;
  grid-template-rows: 1fr;
  grid-template-areas: "mainimage imagelist";
  box-sizing: border-box;
`;

const StyledMainImage = styled.img`
  width: 100%;
  border-radius: 1rem;
  margin-bottom: 0.5rem;
  grid-area: mainimage;
`;

const StyledImageList = styled.div`
  overflow-y: scroll;
  overflow-x: hidden;
  margin-left: 1rem;
`;

const StyledImage = styled.img`
  width: 48%;
  display: inline-block;
  border-radius: 1rem;
  margin-bottom: 4%;
  cursor: pointer;
  &:nth-child(odd) {
    margin-right: 4%;
  }
`;

export const ImageGallery = (props) => {
  const [currentImage, setCurrentImage] = createSignal(props.images[0] || {});

  createEffect(() => {
    const curr_image = currentImage();
    // Check for the image in the images array
    let curr_image_found = false;
    props.images.forEach((image) => {
      if (image.url === curr_image.url) curr_image_found = true;
    });
    if (props.images.length && (!curr_image || !curr_image.url || !curr_image_found)) {
      setCurrentImage(props.images[0]);
    }
  });

  return (
    <>
      {(props?.images || []).length && (
        <StyledContainer class={props.class}>
          <StyledMainImage src={currentImage().url} />
          <StyledImageList>
            <For each={props.images}>
              {(image) => {
                return (
                  <StyledImage
                    src={image.url}
                    onClick={() => {
                      setCurrentImage(image);
                    }}
                  />
                );
              }}
            </For>
          </StyledImageList>
        </StyledContainer>
      )}
    </>
  );
}
