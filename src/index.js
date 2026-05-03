import React from "react";
import "./i18n";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import { SocketProvider } from "./context/SocketContext";
import { HAStatusProvider } from "./context/HAStatusContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <SocketProvider>
        <HAStatusProvider>
          <Routes>
            <Route path="/*" element={<App />} />
          </Routes>
        </HAStatusProvider>
      </SocketProvider>
    </Router>
  </React.StrictMode>,
);

reportWebVitals();
