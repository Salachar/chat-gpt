import { styled } from 'solid-styled-components';
import { Button } from "@inputs";

export const StyledContainer = styled.div`
  position: relative;
  background-color: gray;

  grid-template-columns: 1fr 32rem;
  grid-template-rows: 1fr;
  grid-template-areas: "preview maplist";
  background-color: var(--color-main-dark);
  display: none;

  ${({ open }) => open && `
    display: grid;
  `}
`;

// #map_preview
export const StyledPreview = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
`;

// .header
export const StyledHeader = styled.div`
  height: var(--modal-header-height);
  line-height: var(--modal-header-height);
  font-size: 1rem;
  background-color: var(--color-el-1);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 8rem;
  grid-template-rows: 1fr;
  grid-template-areas: "search close";
`;

// #map_list_search .search_input
export const StyledSearchInput = styled.input`
  position: relative;
  box-sizing: border-box;
  margin: 0;
  width: 100%;
  outline: 0;
  grid-area: search;
  padding: 0 0 0 1rem;
  border: 0;
  background-color: rgba(0,0,0,0.3);
  color: rgba(255, 255, 255, 0.5);
  font-size: var(--font-huge);
  height: var(--modal-header-height);
  line-height: var(--modal-header-height);
  font-style: italic;
`;

// .close
export const StyledClose = styled(Button)`
  grid-area: close;
  height: var(--modal-header-height);
  cursor: pointer;
  text-align: center;
  line-height: var(--modal-header-height);
  color: white;

  &:hover {
    background-color: rgba(255, 255, 255, 0.5);
  }
`;

// #map_list_modal_body_list
export const StyledList = styled.div`
  height: 100%;
  overflow: hidden;
  position: relative;
  grid-area: maplist;
  display: grid;
  background-color: var(--color-main);
  grid-template-columns: 1fr;
  grid-template-rows: 3rem 1fr;
  color: wheat;
  grid-template-areas:
    "listheader"
    "files";
`;

export const StyledFiles = styled.div`
  position: relative;
  grid-area: files;
  overflow-y: scroll;
`;

export const StyledMapSectionHeader = styled.div`
  grid-area: listheader;
  padding: 0.25em 0.5em;
  background-color: var(--color-main-dark);
  text-transform: capitalize;
  cursor: pointer;
  margin-bottom: 0.25em;
`;

export const StyledMapSectionContent = styled.div`
  position: relative;
  padding-left: 1em;

  ${({ collapsed }) => collapsed && `
    display: none !important;
  `}
`;

export const StyledMapIndicator = styled.span`
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

export const StyledPreviewVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

export const StyledPreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;
