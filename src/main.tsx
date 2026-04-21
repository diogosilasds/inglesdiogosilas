import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Force dark mode (single futurist theme)
document.documentElement.classList.add("dark");

// Cleanup obsolete TTS storage from previous version
try {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem("mv80-tts-rate");
  }
} catch {
  // ignore
}

createRoot(document.getElementById("root")!).render(<App />);
