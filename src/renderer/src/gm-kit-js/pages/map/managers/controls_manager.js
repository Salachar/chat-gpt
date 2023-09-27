const Button = require('../../../lib/inputs/button');
const NumberInput = require('../../../lib/inputs/numberInput');
const ArrowInput = require('../../../lib/inputs/arrowInput');
const Checkbox = require('../../../lib/inputs/checkbox');
const RadioInput = require('../../../lib/inputs/radio');
const ColorPicker = require('../../../lib/inputs/colorpicker');

class ControlsManager {
  constructor (opts = {}) {
    this.open = false;

    Store.register({
      'deselect_spell_marker': this.deselectSpellMarker.bind(this),
    });
  }

  deselectSpellMarker () {
    this.refs.spell_marker_shape.deselect();
  }

  update (map) {
    this.refs.enable_grid.checked = map.managers.canvas.canvases.grid.attributes.show;
    this.refs.grid_size_input.value = map.managers.canvas.canvases.grid.attributes.size;
    this.refs.map_zoom_input.value = map.player_screen_zoom;
    this.refs.player_screen_brightness.value = map.managers.canvas.canvases.image.brightness;
  }

  render () {
    return ['#map_controls_container', [
      ['.menu_icon', {
        click: (e) => {
          this.open = !this.open;
          Store.fire(`${this.open ? 'show' : 'hide'}_map_controls`);
        }
      }, [
        ['.bar'],
        ['.bar'],
        ['.bar'],
      ]],

      ['.body', [
        ['.section', [
          ['.header HTML=Player Screen'],
          new Button('.map_controls_button', {
            text: 'Show on Player Screen',
            store_event: 'show_player_screen',
          }),
          new Button('.map_controls_button', {
            text: 'Show Entire Map',
            store_event: 'show_entire_map'
          }),
          new Button('.map_controls_button', {
            text: 'Fit Map To Screen',
            store_event: 'fit_map_to_screen-(PS)'
          }),
          new Button('.map_controls_button', {
            text: 'Flip Map Vertically',
            store_event: 'flip_map_vertically-(PS)'
          }),
          new NumberInput('#map_zoom_input .hr_mb', {
            text: 'Zoom',
            step: 0.025,
            interval: 20,
            store_key: 'zoom',
            store_event: 'zoom_(ps)',
            parent: this,
          }),
          new NumberInput('#player_screen_brightness', {
            text: 'Brightness',
            min: 0,
            max: 200,
            default_value: 100,
            interval: 30,
            store_key: 'brightness',
            store_event: 'brightness_(ps)',
            parent: this,
          }),
        ]],

        ['.section', [
          ['.header HTML=Grid Overlay'],
          new Checkbox('#enable_grid .hr_pad', {
            parent: this,
            text: 'Enable Grid',
            store_key: 'overlay_grid_enabled',
            store_event: 'overlay_grid_toggled_(ps)'
          }),
          new NumberInput('#grid_size_input .hr_mb', {
            text: 'Size',
            step: 0.25,
            default_value: 50,
            store_key: 'size',
            store_event: 'grid_size_update_(ps)',
            parent: this,
          }),
          new ArrowInput({
            text: 'Position',
            step: 1,
            store_key: 'offset',
            store_event: 'grid_offset_update_(ps)'
          }),
        ]],
      ]],
    ]];
  }
}

module.exports = ControlsManager;
