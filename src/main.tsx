import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Editorial light theme — ensure dark class is removed
document.documentElement.classList.remove("dark");

// Cleanup obsolete TTS storage from previous version
try {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem("mv80-tts-rate");
  }
} catch {
  // ignore
}

createRoot(document.getElementById("root")!).render(<App />);
