import { render } from "solid-js/web";
import { Router, Route, Routes } from "@solidjs/router";
import { store } from '@store';

import { Home } from "./pages/home/Home";
import { Chat } from "./pages/chat/Chat";
import { Rooms } from "./pages/rooms";

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
    // icon: "comment",
    path: "/chat",
    element: Chat,
  },
  {
    name: "Images",
    icon: "image",
    path: "/images",
    element: Chat,
    disabled: true,
  },
  {
    name: "Maps",
    icon: "map-location",
    // icon: "map",
    path: "/maps",
    element: Chat,
    disabled: true,
  },
  {
    name: "Audio",
    // icon: "musique-note",
    // icon: "turntable",
    icon: "radio",
    path: "/audio",
    element: Chat,
    disabled: true,
  },
  {
    name: "Rooms",
    icon: "shop",
    path: "/rooms",
    element: Rooms,
    // disabled: true,
  },
  {
    name: "NPCs",
    icon: "user",
    path: "/npcs",
    element: Chat,
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
  console.log('st')
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
