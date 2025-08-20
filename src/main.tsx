import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider.tsx";
import { SettingsProvider } from "./context/SettingsContext.tsx";
import { HighlightProvider } from "./context/HighlightContext.tsx";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="light" storageKey="quran-app-theme">
    <SettingsProvider>
      <HighlightProvider>
        <App />
      </HighlightProvider>
    </SettingsProvider>
  </ThemeProvider>
);