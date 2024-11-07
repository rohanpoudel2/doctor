import React from "react";
import { createRoot } from "react-dom/client";

import App from "./app";

export const renderDashboardPage = () => {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    return;
  }
  const root = createRoot(rootElement);
  root.render(<App />);
};
