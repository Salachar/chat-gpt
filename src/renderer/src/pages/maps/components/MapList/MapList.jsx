import { createSignal, onMount } from 'solid-js'

import {
  StyledContainer,
  StyledPreview,
  StyledHeader,
  StyledSearchInput,
  StyledClose,
  StyledList,
  StyledMapSectionHeader,
  StyledMapSectionContent,
  StyledFiles,
  StyledPreviewVideo,
  StyledPreviewImage,
} from "./MapList.styled";

import { MapFiles } from './MapFiles';

export const MapList = (props) => {
  const [getMapListOpen, setMapListOpen] = createSignal(false);
  const [getMapList, setMapList] = createSignal({});
  const [getDisplayList, setDisplayList] = createSignal({});

  const [getHoveredFile, setHoveredFile] = createSignal();

  onMount(() => {
    IPC.on('map_list_loaded', (e, map_list) => {
      console.log('map_list_loaded', map_list);
      setMapList(map_list);
      setDisplayList(map_list);
      setMapListOpen(true);
    });

    IPC.on('file_loaded', (e, file) => {
      if (props.onLoad) {
        console.log('file_loaded', file);
        props.onLoad(file);
        setMapListOpen(false);
      }
    });

    // IPC.on('map_directory_chosen', (e) => {
    //   IPC.send('load_map_list');
    // });
  });

  const searchMaps = (search_string) => {
    if (!search_string) {
      setDisplayList(getMapList());
      return;
    }

    let listCopy = JSON.parse(JSON.stringify(getMapList()));

    search(listCopy);

    function search (sections) {
      // A section can only be one of two things:
      // 1. Any name, which is basically a folder/subfolder
      // 2. specically the "files" section, which indicates
      for (let s in sections) {
        if (s === "files") {
          for (let f in sections[s]) {
            let map = sections[s][f];
            let name = map.name.toLowerCase();
            let matchFound = false;
            if (name.indexOf(search_string) !== -1) {
              matchFound = true;
            }
            if (map.variants) {
              // The map has variants, so we need to check those too.
              // We can just check the shortned variant name.
              for (let v in map.variants) {
                if (v.toLowerCase().indexOf(search_string) !== -1) {
                  matchFound = true;
                }
              }
            }
            if (!matchFound) {
              delete sections[s][f];
            }
          }
        } else if (s.toLowerCase().indexOf(search_string) === -1) {
          search(sections[s]);
        }
        // If everything has been removed from the section, delete it
        if (!Object.keys(sections[s]).length) {
          delete sections[s];
        }
      }
    }

    setDisplayList(listCopy);
  }

  return (
    <StyledContainer
      class={props.class}
      open={getMapListOpen()}
      data-testid="maplistcontainer"
    >
      <MapListPreview file={getHoveredFile()} />

      <StyledList data-testid="maplist">
        <StyledHeader>
          <StyledSearchInput
            placeholder="SEARCH"
            onKeyUp={(e) => {
              let search_string = e.currentTarget.value || "";
              search_string = search_string.trim();
              search_string = search_string.toLowerCase();
              searchMaps(search_string);
            }}
          />
          <StyledClose label="Close" onClick={() => {
            // this.closeModal();
            setMapListOpen(false);
          }} />
        </StyledHeader>
        <StyledFiles data-testid="mapfiles">
          <MapListSection
            section={getDisplayList()}
            onFileHover={(file) => {
              setHoveredFile(file);
            }}
            onFileClick={(file) => {
              IPC.send('load_file', file);
              // this.closeModal();
            }}
          />
        </StyledFiles>
      </StyledList>
    </StyledContainer>
  );
}

const MapListPreview = (props) => {
  return (
    <StyledPreview data-testid="mappreview">
      {props?.file?.video && (
        <StyledPreviewVideo src={props.file.video} loop autoplay muted />
      )}
      {props?.file?.image && (
        <StyledPreviewImage src={props.file.image} />
      )}
    </StyledPreview>
  );
};

const MapListSection = (props) => {
  if (props.section.files) {
    return (
      <MapFiles
        files={props.section.files}
        onFileHover={props.onFileHover}
        onFileClick={props.onFileClick}
      />
    );
  } else {
    // Then continue through subsections
    return (
      <>
        {Object.keys(props.section).map((subSectionName) => {
          // Files have already been handled
          if (subSectionName === "files") return;

          return (
            <MapListSingleSection
              subSectionName={subSectionName}
              section={props.section}
              onFileHover={props.onFileHover}
              onFileClick={props.onFileClick}
            />
          );
        })}
      </>
    );
  }
}

const MapListSingleSection = (props) => {
  const [getCollpased, setCollapsed] = createSignal(false);

  return (
    <div>
      <StyledMapSectionHeader onClick={() => {
        setCollapsed(!getCollpased());
      }}>{props.subSectionName}</StyledMapSectionHeader>
      <StyledMapSectionContent collapsed={getCollpased()}>
        <MapListSection
          section={props.section[props.subSectionName]}
          onFileHover={props.onFileHover}
          onFileClick={props.onFileClick}
        />
      </StyledMapSectionContent>
    </div>
  );
}
