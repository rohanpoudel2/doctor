import React from "react";
import { createRoot } from "react-dom/client";
import Home from "./Home";

export const renderDashboardPage = () => {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    return;
  }
  const root = createRoot(rootElement);
  root.render(<Home />);
};
