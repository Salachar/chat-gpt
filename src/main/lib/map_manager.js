import { ipcMain as IPC } from 'electron'
import fs from 'fs';
import path, { join } from 'path';
import url from 'url';

import GMConfig from './config';
import FileHelpers from './file_helpers';
import { copy } from '../../utils';

const DM_VARIATIONS = ['DM_', '_DM', ' DM', 'DM ', '(DM)', '[DM]'];
const DM_VARIATIONS_LENGTH = DM_VARIATIONS.length;

class MapManager {
  constructor () {
    this.list = {};
    this.setIPCEvents();
  }

  setIPCEvents () {
    IPC.on('load_map_list', (e) => {
      this.loadMapList();
    });

    IPC.on('refresh_map_list', (e) => {
      this.list = {};
      this.loadMapList();
    });

    // IPC.on('load_maps', (e, maps = {}) => {
    //   let loaded_maps = {};
    //   for (let m in maps) {
    //     const map = maps[m];
    //     if (map.json_exists) map.json = FileHelpers.readJSON(map.json_directory);
    //     loaded_maps[map.name] = map;
    //   }
    //   global.shared.mainWindow.webContents.send('maps_loaded', loaded_maps);
    // });

    IPC.on('load_file', (e, file = {}) => {
      if (file.json_exists) {
        file.json = FileHelpers.readJSON(file.json_directory);
      } else {
        file.json = {};
      }
      if (!file.json.meta) {
        file.json.meta = {};
      }
      global.shared.mainWindow.webContents.send('file_loaded', file);
    });

    IPC.on('save_maps', (e, maps = {}) => {
      const map_keys = Object.keys(maps);
      map_keys.forEach((map_key) => {
        const map = maps[map_key];
        try {
          const file_json = JSON.stringify(map.json, null, 4);
          fs.writeFileSync(map.json_directory, file_json, 'utf-8');
        } catch (e) {
          console.log('Unable to save map: ' + map.name);
        }
      });

      let message = `${map_keys.length} maps`;
      if (map_keys.length === 1) {
        message = `Map:${maps[map_keys[0]].name}`;
      }

      global.shared.mainWindow.webContents.send('message', {
        type: 'success',
        text: `${message} sucessfully saved`
      });
    });
  }

  loadMapList () {
    if (!GMConfig.map_directory) {
      GMConfig.chooseDirectory('map', (folder_path) => {
        global.shared.mainWindow.webContents.send('map_list_loaded', this.generateList());
      });
    } else {
      if (Object.keys(this.list || {}).length) {
        global.shared.mainWindow.webContents.send('map_list_loaded', this.list);
      } else {
        const list = this.generateList();
        global.shared.mainWindow.webContents.send('map_list_loaded', list);
      }
    }
  }

  generateList () {
    this.list = {};

    let directory_split = GMConfig.map_directory.split(path.sep);
    this.main_folder_name = directory_split[directory_split.length - 1];

    FileHelpers.readDir(GMConfig.map_directory, {
      types: ['image', 'video'],
      onFile: (dir, item, type) => {
        this.investigateFile(dir, item, type);
      },
      onError: (error) => {
        console.log(error);
      },
    });

    // There are some garbage folders we don't want to show
    // "Roll20" and "Gridless" are examples of folders that
    // are filler and we want their contents to be moved up
    // and their folder removed
    const garbage_folders = ['Roll20', 'Gridded', 'Grid', 'Grid Versions'];
    // Recurse through the list and remove the garbage folders
    const removeGarbageFolders = (list) => {
      for (let key in list) {
        if (garbage_folders.includes(key)) {
          // Move the contents of the garbage folder up
          // and delete the garbage folder
          const garbage_folder = list[key];
          delete list[key];
          for (let k in garbage_folder) {
            list[k] = garbage_folder[k];
          }
          // We need to re-run the loop because we've changed
          // the list object
          removeGarbageFolders(list);
        } else if (typeof list[key] === 'object') {
          // Recurse through the list
          removeGarbageFolders(list[key]);
        }
      }
    };
    removeGarbageFolders(this.list);

    this.checkForVariations(this.list);

    return this.list;
  }

  checkForVariations (list) {
    /*
      Variation examples:
      "ANCIENT DWARVEN UNDEGROUND CITY 1 (cobwebs)"
      "ANCIENT DWARVEN UNDEGROUND CITY 1 (no cobwebs)"
      "CaveTunnelsVol4-1"
      "CaveTunnelsVol4-2"
      "CaveTunnelsVol4-3"
    */

    // Recurse through the list and check all "files" objects.
    // Each field name is a map name we want to check for variations
    // within the list. Map variants can be found by checking for "(" and "-".
    // If variants are found we want to add a new item to the "files" object
    // representing the base map name. This base map will have a "variants"
    // object which will basically look like the "files" object.
    const checkVariations = (list) => {
      for (let key in list) {
        if (key === 'files') {
          // Check for variations
          const files = list[key];
          // We'll need to reset this and go through it again each time we find a variation
          // as we may be adding a base or deleting a variation
          let objectKeys = Object.keys(files);
          let index = 0;

          // for (let file_key in files) {
          // for (; index < objectKeys.length; ++index) {
          while (index < objectKeys.length) {
            // const file = files[file_key];
            const file_key = objectKeys[index];
            const file = files[file_key];
            const file_name = file.name;

            if (file_name.indexOf('(') !== -1 || file_name.indexOf('-') !== -1) {
              // We have a variation, create the base map
              const base_map_name = file_name.replace(/(\s*\(.*\))|(\s*-.*)/g, '');

              // Its a little expensive, but we should check to see if the map is worth
              // splitting or if its a false positive. As long as one other map exists
              // that substring matches the base map name, we'll assume its a variation
              let found = false;
              for (let i = 0; i < objectKeys.length; ++i) {
                const other_file_key = objectKeys[i];
                const other_file = files[other_file_key];
                const other_file_name = other_file.name;
                if (other_file_name.indexOf(base_map_name) !== -1 && other_file_name !== file_name) {
                  found = true;
                  break;
                }
              }
              if (!found) {
                ++index;
                continue;
              }

              // Add the base map to the list
              if (!files[base_map_name]) {
                files[base_map_name] = {
                  ...copy(file),
                  name: base_map_name,
                  variants: {},
                };
              }
              // Sometimes the base map exists with the proper name
              // so the map will exist but not have a variants object
              if (!files[base_map_name].variants) {
                files[base_map_name].variants = {};
                // In this scenario the base map wont be validated, since it wont match
                // the variation trigger. So we need to add it to the list of variations
                // as "base"
                files[base_map_name].variants.base = copy(files[base_map_name]);
              }
              // Add the variation
              let variation_name = file_name.replace(base_map_name, '').trim();
              // strip off any leading hyphens, parens can stay
              variation_name = variation_name.replace(/^-+/, '').trim();
              files[base_map_name].variants[variation_name] = copy(file);
              // Remove the variation from the list
              delete files[file_key];
              // We need to re-run the loop because we've changed
              // the list object
              objectKeys = Object.keys(files);
              index = 0;
            } else {
              ++index;
            }
          }
        } else if (typeof list[key] === 'object') {
          // Recurse through the list
          checkVariations(list[key]);
        }
      }
    }

    checkVariations(list);

  }

  investigateFile (dir, item, type) {
    // type is 'video' or 'image' based on the types passed into readDir
    const [file_name, file_type] = item.split('.');

    // If the file is a DM image, skip it
    if (file_name.match(/DM_|_DM| DM|DM |(DM)/)) return;

    // For non-DM images, Search for the DM version of the map
    let dm_version = null;
    for (let i = 0; i < DM_VARIATIONS_LENGTH; ++i) {
      const dm_ext = DM_VARIATIONS[i];
      // Check prepended dm version
      let dm_file_name = `${dm_ext}${file_name}.${file_type}`;
      dm_version = fs.existsSync(`${dir}/${dm_file_name}`) ? dm_file_name : null;
      if (dm_version) break;
      // Check appended dm version
      dm_file_name = `${file_name}${dm_ext}.${file_type}`;
      dm_version = fs.existsSync(`${dir}/${dm_file_name}`) ? dm_file_name : null;
      if (dm_version) break;
    }

    const json_directory = join(GMConfig.json_directory, 'maps', `${file_name}.json`);
    // Create the file object
    // let fileUrl = url.pathToFileURL(filePath).toString();

    let file_obj = {
      name: file_name,
      type: type,
      // [type]: join(dir, item),
      [type]: url.pathToFileURL(join(dir, item)).toString(),
      // dm_version: dm_version && join(dir, dm_version),
      dm_version: dm_version && url.pathToFileURL(join(dir, dm_version)).toString(),
      json_directory: json_directory,
      json_exists: fs.existsSync(json_directory),
    };

    this.addToMapList(dir, file_obj);
  }

  addToMapList (dir, file_obj) {
      // Remove the map directory path and only the leading path separator character
    const relative_directory = dir.replace(GMConfig.map_directory, '').replace(path.sep, '');
    const dir_split = [this.main_folder_name, ...relative_directory.split(path.sep), 'files'].filter(e => e);

    let curr = this.list;
    for (let i = 0; i <= dir_split.length; ++i) {
      if (i === dir_split.length) {
        // We've created the full path in the list, now
        // add the file under the file name
        curr[file_obj.name] = file_obj;
      } else {
        // Keep moving through list and create objects when needed
        const n = dir_split[i];
        curr[n] = curr[n] || {};
        curr = curr[n];
      }
    }
  }
}

export default new MapManager();
