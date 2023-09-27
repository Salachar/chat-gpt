import { onMount } from 'solid-js'
import { styled, css  } from 'solid-styled-components';

import { Button } from '@inputs';
import { ArrowInput, Checkbox, NumberInput } from "@components/gm-kit-inputs";

const StyledSection = styled.div`
  position: relative;
  margin-bottom: 1rem;
`;

const StyledContainer = styled.div`
  position: relative;
  overflow-y: auto;
  padding-top: 1rem;
  color: wheat;
`;

const StyledHeader = styled.div`
  position: relative;
  text-align: inherit;
  padding: 0 1rem;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 1rem;
  margin-bottom: 0.5rem;
`;

const ControlInputClass = css`
  margin-bottom: 0.5rem;
`;

export const Controls = (props) => {
  onMount(() => {
    Store.register({
      'deselect_spell_marker': () => {
        // this.refs.spell_marker_shape.deselect();
      },
    });
  });

  // const update = (map) => {
  //   this.refs.enable_grid.checked = map.managers.canvas.canvases.grid.attributes.show;
  //   this.refs.grid_size_input.value = map.managers.canvas.canvases.grid.attributes.size;
  //   this.refs.map_zoom_input.value = map.player_screen_zoom;
  //   this.refs.player_screen_brightness.value = map.managers.canvas.canvases.image.brightness;
  // }

  return (
    <StyledContainer class={props.class}>
      <StyledSection style={{
        "padding-right": '1rem',
        "text-align": "left",
      }}>
        <Button
          class={ControlInputClass}
          toUpperCase
          borderRadius="right"
          label="Load"
          ipcEvent="load_map_list"
        />
        <Button
          class={ControlInputClass}
          toUpperCase
          borderRadius="right"
          label="Save"
          onClick={() => {
            // this.saveMaps();
          }}
        />
        <Button
          class={ControlInputClass}
          toUpperCase
          borderRadius="right"
          label="Save All"
          onClick={() => {
            // const map_data = getAllMapData();
            // if (!map_data) return Toast.error('There are no maps to save');
            // IPC.send('save_maps', map_data);
          }}
        />
      </StyledSection>

      <StyledSection style={{
        "padding": "0 1rem",
      }}>
        <StyledHeader>Map Controls</StyledHeader>
        <Checkbox
          class={ControlInputClass}
          title='Modifies an existing wall'
          label='One-Way Wall'
          store_key='create_one_way_wall'
          store_event='create_one_way_wall_toggled'
        />
        <Checkbox
          class={ControlInputClass}
          label="Enable Grid"
          storeKey="overlay_grid_enabled"
          storeEvent="overlay_grid_toggled_(ps)"
        />
        <NumberInput
          class={ControlInputClass}
          label="Grid Size"
          step={0.25}
          defaultValue={50}
          storeKey="size"
          storeEvent="grid_size_update_(ps)"
        />
        <ArrowInput
          class={ControlInputClass}
          label="Grid Position"
          step={1}
          storeKey="offset"
          storeEvent="grid_offset_update_(ps)"
        />
      </StyledSection>

      <StyledSection style={{
        "padding-left": '1rem',
        "text-align": "right",
      }}>
        <StyledHeader>Player Screen</StyledHeader>
        <Button
          class={ControlInputClass}
          toUpperCase
          borderRadius="left"
          label="Show on Player Screen"
          storeEvent="show_player_screen"
        />
        <Button
          class={ControlInputClass}
          toUpperCase
          borderRadius="left"
          label="Show Entire Map"
          storeEvent="show_entire_map"
        />
        <Button
          class={ControlInputClass}
          toUpperCase
          borderRadius="left"
          label="Fit Map To Screen"
          storeEvent="fit_map_to_screen-(PS)"
        />
        <Button
          class={ControlInputClass}
          toUpperCase
          borderRadius="left"
          label="Flip Map Vertically"
          storeEvent="flip_map_vertically-(PS)"
        />
        <div style={{
          "padding-right": '1rem',
        }}>
          <NumberInput
            class={ControlInputClass}
            label="Zoom"
            step={0.025}
            interval={20}
            defaultValue={12}
            storeKey="zoom"
            storeEvent="zoom_(ps)"
          />
          <NumberInput
            class={ControlInputClass}
            label="Brightness"
            min={0}
            max={200}
            step={1}
            interval={30}
            defaultValue={100}
            storeKey="brightness"
            storeEvent="brightness_(ps)"
          />
        </div>
      </StyledSection>
    </StyledContainer>
  );
}
