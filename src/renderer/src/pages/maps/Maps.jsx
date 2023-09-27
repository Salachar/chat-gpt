import { createSignal, onMount, onCleanup } from 'solid-js'
import { SidebarContainer } from '@components/SidebarContainer';

import { styled } from 'solid-styled-components';

import { Controls } from './components/Controls';
import { MapList } from './components/MapList';

const StyledContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: grid;
  grid-template-columns: 1fr 14rem;
  grid-template-rows: 1fr;
  grid-template-areas: "maps controls";
`;

const StyledMapList = styled(MapList)`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 20;
`;

// import { MapList } from './components/MapList';
// const MapInstance = require('./instance');
// const Lib = require('../../lib');
// const {
//   resetSnap,
// } = Lib.helpers;

export const Maps = () => {
  const [getMap, setMap] = createSignal({});
  const [getMaps, setMaps] = createSignal({});
  const [getCurrentMap, setCurrentMap] = createSignal(null);
  const [getShowMapControls, setShowMapControls] = createSignal(false);

  onMount(() => {
    Store.register({
      'save_maps': saveMaps,
      'mouse_leave': () => {
        disableSegmentMove();
        disableSegmentQuickPlace();
      },
    });
  });

  onCleanup(() => {

  });

  const saveMaps = () => {
    const map_data = getMapData();
    if (!map_data) return Toast.error('There is no map to save');
    IPC.send('save_maps', map_data);
  }

  const onKeyDown = (keyCode) => {
    switch (keyCode) {
      case KEYS.CONTROL:
        enableSegmentMove();
        Store.fire('move_mode_toggled');
        break;

      case KEYS.SHIFT:
        enableSegmentQuickPlace();
        break;

      default:
        // console.log('APP >> Keydown: Unhandled keyCode: ' + keyCode);
        break;
    }

    const current_map = getCurrentMap();
    if (current_map) {
      current_map.onKeyDown(keyCode);
    }
  }

  const onKeyUp = (keyCode) => {
    switch (keyCode) {
      case KEYS.CONTROL:
        disableSegmentMove();
        break;

      case KEYS.SHIFT:
        disableSegmentQuickPlace();
        break;

      default:
        // console.log('APP >> Keyup: Unhandled keyCode: ' + e.keyCode);
        break;
    }

    const current_map = getCurrentMap();
    if (current_map) {
      current_map.onKeyUp(keyCode);
    }
  }

  const enableSegmentMove = () => {
    CONFIG.move_mode = true;
    CONFIG.quick_place = false;
  }

  const disableSegmentMove = () => {
    CONFIG.move_mode = false;
    CONFIG.quick_place = false;
  }

  const enableSegmentQuickPlace = () => {
    CONFIG.move_mode = false;
    CONFIG.quick_place = true;
  }

  const disableSegmentQuickPlace = () => {
    CONFIG.move_mode = false;
    CONFIG.quick_place = false;
  }

  const setActiveMap = (map_name) => {
    Store.fire('onmaphide');
    Store.key = map_name;
    Store.fire('onmapshow');

    const maps = getMaps();
    const current_map = getCurrentMap();

    if (current_map) {
      current_map.active = false;
      current_map.hide();
    }

    current_map = maps[map_name];
    current_map.active = true;
    current_map.show();

    // This will eventually be
    // this.ControlsManager.update(this.current_map);

    Store.set({
      current_map_data: (current_map || {}).full_data || {},
    });
  }

  const removeMap = (map_name) => {
    const maps = getMaps();
    const current_map = getCurrentMap();

    let removing_current_map = (current_map.name === map_name);
    Store.remove(map_name);
    // resetSnap();

    Store.fire('player_screen_remove_map', {
      map_name: map_name,
    });

    // maps[map_name].shutdown();
    // delete maps[map_name];

    let map_keys = Object.keys(maps);
    if (removing_current_map && map_keys.length) {
      setActiveMap(map_keys[map_keys.length - 1]);
    }

    if (!map_keys.length) {
      Store.clearKeys();
      document.getElementById('no_map_screen').classList.remove('hidden');
    }
  }

  const getMapData = () => {
    const current_map = getCurrentMap();
    if (!current_map) return;
    let map_data = {};
    map_data[current_map.name] = current_map.data;
    return map_data;
  }

  const getAllMapData = () => {
    const maps = getMaps();
    if (!Object.keys(maps).length) return;
    let map_data = {};
    for (let m in maps) {
      map_data[maps[m].name] = maps[m].data;
    }
    return map_data;
  }

  /* <MapTabs
    maps
    setActiveMap={setActiveMap}
    removeMap={removeMap}
  /> */

  return (
    <SidebarContainer>
      <StyledContainer>
        <div style={{
          "grid-area": 'maps',
          "background-color": "var(--color-main-dark)",
        }}>
          {Object.keys(getMaps()).map((map) => {
            return null;
          })}
        </div>

        <Controls
          style={{
            "grid-area": "controls",
          }}
          map={getMap()}
        />

        <StyledMapList onLoad={(file) => {
          if (!file) return;

          // if (this.maps[map.name]) {
          //   Toast.message(`Map "${map.name}" is already loaded`);
          //   return;
          // }

          // this.maps[map.name] = new MapInstance(map, {
          //   manager: this,
          // });

          // this.addMapTab(map);
          // this.maps[map.name].hide();

          // this.setActiveMap(map_keys[map_keys.length - 1]);
          // document.getElementById('no_map_screen').classList.add('hidden');
        }} />
      </StyledContainer>
    </SidebarContainer>
  );
}
