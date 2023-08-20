import { render } from "solid-js/web";
import { Router, Route, Routes } from "@solidjs/router";
import { store } from '@store';

import { Home } from "./pages/home/Home";
import { Chat } from "./pages/chat/Chat";
import { Images } from "./pages/images";
import { Maps } from "./pages/maps";
import { Audio } from "./pages/audio";
import { Rooms } from "./pages/rooms";
import { NPCs } from "./pages/npcs";

import ChatIPCEvents from "./ipc/chat";
const chatIPCEvents = new ChatIPCEvents();

import RoomIPCEvents from "./ipc/rooms";
const roomIPCEvents = new RoomIPCEvents();

import 'prismjs/themes/prism-tomorrow.css';
import './assets/index.css';

export const PAGES = [
  {
    name: "Home",
    icon: "home",
    path: "/",
    element: Home,
  },
  {
    name: "Chat",
    icon: "chat",
    path: "/chat",
    element: Chat,
  },
  {
    name: "Images",
    icon: "image",
    path: "/images",
    element: Images,
    disabled: true,
  },
  {
    name: "Maps",
    icon: "map-location",
    path: "/maps",
    element: Maps,
    disabled: true,
  },
  {
    name: "Audio",
    icon: "radio",
    path: "/audio",
    element: Audio,
    disabled: true,
  },
  {
    name: "Rooms",
    icon: "shop",
    path: "/rooms",
    element: Rooms,
  },
  {
    name: "NPCs",
    icon: "user",
    path: "/npcs",
    element: NPCs,
    disabled: true,
  },
];

IPC.on('model-list', (event, data) => {
  store.setDefaultModel(data.default_model);
  store.setModels(data.models);
});

IPC.on('onload', (event, events = []) => {
  if (!Array.isArray(events)) events = [];
  store.setEvents(events);
});

IPC.on('no-openai-api-key', (event, data) => {
  store.setNoAPIKey(true);
});

IPC.send('onload');

render(
  () => (
    <Router>
      <Routes>
        <For each={PAGES}>
          {({ path, element }) => (
            <Route path={path} element={element} />
          )}
        </For>
      </Routes>
    </Router>
  ),
  document.getElementById("root")
);
