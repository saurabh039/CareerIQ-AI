import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import { Toaster } from "sonner";

import App from "./App";
import { AuthProvider } from "./context/AuthContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <Toaster richColors position="top-right" />
<App />
    </AuthProvider>
  </StrictMode>
);