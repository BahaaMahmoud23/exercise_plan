import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import { offlineShell } from "./pwa/vite-plugin.mjs";

export default defineConfig({
  plugins: [react(), offlineShell()],
});
