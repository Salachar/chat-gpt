import { render } from "solid-js/web";
import { Router, Route, Routes } from "@solidjs/router";

import { Chat } from "./pages/chat/Chat";

import 'prismjs/themes/prism-tomorrow.css';
import './assets/index.css';

render(
  () => (
    <Router>
      <Routes>
        <Route path="/" element={Chat}/>
      </Routes>
    </Router>
  ),
  document.getElementById("root")
);
