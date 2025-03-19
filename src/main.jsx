import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import PickProvider from "./components/PickProvider.jsx";

createRoot(document.getElementById("root")).render(
  <PickProvider>
    <App />
  </PickProvider>
);
