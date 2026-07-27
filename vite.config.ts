import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// host:true -> phone on same Wi-Fi can reach http://<pc-ip>:5175.
// Port 5175: EPT trainer uses 5173/5174, avoid clashing.
// base: served from GitHub Pages project path /poker-from-zero/ (hash routing works under it).
export default defineConfig({
  base: "/poker-from-zero/",
  plugins: [react()],
  server: { host: true, port: 5175 },
});
