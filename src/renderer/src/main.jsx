import { render } from "solid-js/web";
import { Router, Route, Routes } from "@solidjs/router";

import { Home } from "./pages/home/Home";
import { Chat, store as chatStore } from "./pages/chat";
import { Images } from "./pages/images";
import { Maps } from "./pages/maps";
import { Audio } from "./pages/audio";
import { Rooms, store as roomStore } from "./pages/rooms";
import { NPCs } from "./pages/npcs";

import Store from "./gm-kit-js/store";
window.Store = Store;

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
    store: chatStore,
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
    disabled: false,
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
    store: roomStore,
    disabled: false,
  },
  {
    name: "NPCs",
    icon: "user",
    path: "/npcs",
    element: NPCs,
    disabled: true,
  },
];

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
