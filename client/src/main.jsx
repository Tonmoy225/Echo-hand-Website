import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";
import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: "#13102B",
            color: "#F5F3FF",
            border: "1px solid #2D2550",
            fontSize: "0.875rem",
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);
