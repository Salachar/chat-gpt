import { render } from "solid-js/web";
import { Router, Route, Routes } from "@solidjs/router";

import { Home } from "./pages/home/Home";
import { Chat } from "./pages/chat/Chat";
import { Images } from "./pages/images";
import { Maps } from "./pages/maps";
import { Audio } from "./pages/audio";
import { Rooms } from "./pages/rooms";
import { NPCs } from "./pages/npcs";

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
