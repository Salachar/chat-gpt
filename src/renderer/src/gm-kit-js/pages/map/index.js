const Container = require('../base');

const ControlsManager = require('./managers/controls_manager');
const MapListManager = require('./managers/map_list_manager');
const TextManager = require('./managers/text_manager');

const Button = require('../../lib/inputs/Button');
const Checkbox = require('../../lib/inputs/checkbox');

const MapInstance = require('./instance');
const Lib = require('../../lib');

const {
  resetSnap,
} = Lib.helpers;

class MapContainer extends Container {
  constructor (opts = {}) {
    super({
      ...opts,
      type: 'map',
    });

    this.maps = {};
    this.current_map = null;

    this.TextManager = new TextManager();
    this.ControlsManager = new ControlsManager();

    Store.register({
      'save_maps': this.saveMaps.bind(this),
      'mouse_leave': this.onMouseLeave.bind(this),
      'show_map_controls': this.showMapControls.bind(this),
      'hide_map_controls': this.hideMapControls.bind(this),
    });

    this.render();
  }

  showMapControls () {
    this.refs.map_main_section.classList.add('open');
  }

  hideMapControls () {
    this.refs.map_main_section.classList.remove('open');
  }

  onMouseLeave () {
    // Currently these do the same, probably will always remain redundant
    this.disableSegmentMove();
    this.disableSegmentQuickPlace();
  }

  onKeyDown (keyCode) {
    switch (keyCode) {
      case KEYS.CONTROL:
        this.enableSegmentMove();
        Store.fire('move_mode_toggled');
        break;

      case KEYS.SHIFT:
        if (Store.get('spell_marker_shape') && !Store.get('show_affected_tiles_checked')) {
          Store.fire('show_affected_tiles_toggled-(ps)', {
            'show_affected_tiles': true
          });
        } else {
          this.enableSegmentQuickPlace();
        }
        break;

      default:
        // console.log('APP >> Keydown: Unhandled keyCode: ' + keyCode);
        break;
    }

    if (this.current_map) {
      this.current_map.onKeyDown(keyCode);
    }
  }

  onKeyUp (keyCode) {
    switch (keyCode) {
      case KEYS.CONTROL:
        this.disableSegmentMove();
        break;

      case KEYS.SHIFT:
        if (Store.get('spell_marker_shape') && !Store.get('show_affected_tiles_checked')) {
          Store.fire('show_affected_tiles_toggled-(ps)', {
            'show_affected_tiles': false
          });
        } else {
          this.disableSegmentQuickPlace();
        }
        break;

      default:
        // console.log('APP >> Keyup: Unhandled keyCode: ' + e.keyCode);
        break;
    }

    if (this.current_map) {
      this.current_map.onKeyUp(keyCode);
    }
  }

  enableSegmentMove () {
    CONFIG.move_mode = true;
    CONFIG.quick_place = false;
  }

  disableSegmentMove () {
    CONFIG.move_mode = false;
    CONFIG.quick_place = false;
  }

  enableSegmentQuickPlace () {
    CONFIG.move_mode = false;
    CONFIG.quick_place = true;
  }

  disableSegmentQuickPlace () {
    CONFIG.move_mode = false;
    CONFIG.quick_place = false;
  }

  onMapLoad (maps) {
    let map_keys = Object.keys(maps);
    if (!map_keys.length) return;

    let map = null
    for (let i = 0; i < map_keys.length; ++i) {
      map = maps[map_keys[i]];
      this.addMap(map);
    }

    this.setActiveMap(map_keys[map_keys.length - 1]);
    document.getElementById('no_map_screen').classList.add('hidden');
  }

  saveMaps () {
    const map_data = this.getMapData();
    if (!map_data) return Toast.error('There is no map to save');
    IPC.send('save_maps', map_data);
  }

  setActiveMap (map_name) {
    Store.fire('onmaphide');
    Store.key = map_name;
    Store.fire('onmapshow');

    if (this.current_map) {
      this.current_map.active = false;
      this.current_map.hide();
    }

    this.current_map = this.maps[map_name];
    this.current_map.active = true;
    this.current_map.show();
    this.ControlsManager.update(this.current_map);

    Store.set({
      current_map_data: (this.current_map || {}).full_data || {},
    });
  }

  addMap (map) {
    if (this.maps[map.name]) {
      Toast.message(`Map "${map.name}" is already loaded`);
      return;
    }
    this.maps[map.name] = new MapInstance(map, {
      manager: this,
    });
    this.addMapTab(map);
    this.maps[map.name].hide();
  }

  removeMap (map_name) {
    let removing_current_map = (this.current_map.name === map_name);
    Store.remove(map_name);
    resetSnap();

    Store.fire('player_screen_remove_map', {
      map_name: map_name,
    });

    this.maps[map_name].shutdown();
    delete this.maps[map_name];

    let map_keys = Object.keys(this.maps);
    if (removing_current_map && map_keys.length) {
      this.setActiveMap(map_keys[map_keys.length - 1]);
    }

    if (!map_keys.length) {
      Store.clearKeys();
      document.getElementById('no_map_screen').classList.remove('hidden');
    }
  }

  addMapTab (map) {
    const tabs = document.getElementById('map_tabs');
    const { name } = map;
    Lib.dom.generate([`div .map_tab HTML=${name}`, {
      oncreate: (node) => {
        this.maps[name].tab = node;
      },
      click: (e) => {
        if (e.defaultPrevented) return;
        this.setActiveMap(name);
      },
    }, [
      ['.map_tab_close', {
        click: (e) => {
          e.preventDefault();
          this.removeMap(name);
        }
      }]
    ]], null, tabs);
  }

  getMapData () {
    if (!this.current_map) return;
    let map_data = {};
    map_data[this.current_map.name] = this.current_map.data;
    return map_data;
  }

  getAllMapData () {
    if (!Object.keys(this.maps).length) return;
    let map_data = {};
    for (let m in this.maps) {
      map_data[this.maps[m].name] = this.maps[m].data;
    }
    return map_data;
  }

  render () {
    Lib.dom.generate([
      ['.container_header', [
        ['.header_controls', [
          new Button({
            text: 'Load',
            ipc_event: 'load_map_list',
          }),

          ['.spacer'],

          new Button({
            text: 'Save',
            onclick: (e) => this.saveMaps(),
          }),

          new Button({
            text: 'Save All',
            onclick: (e) => {
              const map_data = this.getAllMapData();
              if (!map_data) return Toast.error('There are no maps to save');
              IPC.send('save_maps', map_data);
            }
          }),

          ['.spacer'],

          new Checkbox({
            title: 'Modifies an existing wall',
            text: 'One-Way Wall',
            store_key: 'create_one_way_wall',
            store_event: 'create_one_way_wall_toggled',
          }),
        ]],

        // Text Manager gets created and added
        this.TextManager.render(),

        ['#map_tabs'],
      ]],

      ['.container_body', [
        ['#map_main_section', [
          ['#map_containers'],

          this.ControlsManager.render(),

          new MapListManager({
            onMapLoad: this.onMapLoad.bind(this)
          }).render(),
        ]]
      ]]
    ], this, this.node);
  }
}

module.exports = MapContainer;
