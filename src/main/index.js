require('dotenv').config();

import { app, shell, BrowserWindow } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset';
import dock_icon from '../../resources/snippy_clear.png?asset';
import contextMenu from 'electron-context-menu';

app.dock.setIcon(dock_icon);

const OPENAI_API_KEY = process.env.OPENAI;

import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
  apiKey: OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

import AIManager from './ai-manager';
const ai_manager = new AIManager(openai);

global.shared = {
  mainWindow: null,
};

contextMenu({
	showSaveImageAs: true
});

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1600,
    height: 1000,
    x: 100,
    y: 60,
    show: false,
    autoHideMenuBar: true,
    icon: join(__dirname, icon),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      // sandbox: false
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      webSecurity: false,
    }
  })
  global.shared.mainWindow = mainWindow;
  mainWindow.webContents.openDevTools();

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();

    // If there is no OPENAI_API_KEY, send a message to the renderer saying so.
    if (!OPENAI_API_KEY) {
      mainWindow.webContents.send('no-openai-api-key');
    }

    ai_manager.onWindowReady();
  })

  // Kill the app if the main window is closed
  mainWindow.on('closed', () => {
    app.quit();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  });

  createWindow();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  });
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
