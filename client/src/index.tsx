import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

// tell typescript to expect 'env' property in 'window' object so
// we can get env variable by 'window.env.my_external_service_url'
declare global {
  interface Window {
    env: any;
  }
}

const container = document.getElementById("app-root")!;
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
