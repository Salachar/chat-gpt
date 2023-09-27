import {
  StyledTabs,
  StyledTab,
  StyledClose,
} from "./MapTabs.styled";

export const MapTabs = ({
  maps = [],
  setActiveMap = () => {},
  removeMap = () => {},
}) => {
  return (
    <StyledTabs>
      {maps.map((map) => {
        const { name } = map;

        return (
          <StyledTab onClick={(e) => {
            // if (e.defaultPrevented) return;
            // setActiveMap(name);
          }}>
            {name}
            <StyledClose onClick={(e) => {
              // e.preventDefault();
              // removeMap(name);
            }}/>
          </StyledTab>
        );
      })}
    </StyledTabs>
  );
}
