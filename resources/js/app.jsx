import "./bootstrap";

import React from "react";
import { createRoot } from "react-dom/client";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import App from "./components/App";

const container = document.getElementById("app");
const root = createRoot(container);
root.render(<App />);

library.add(fas);
