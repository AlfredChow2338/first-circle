import React from "react";
import ReactDOM from "react-dom/client";

import { registerOfflineServiceWorker } from "src/offline/registerServiceWorker";

import App from "./App";
import "./styles/global.css";
import "./styles/responsive.css";

registerOfflineServiceWorker();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
