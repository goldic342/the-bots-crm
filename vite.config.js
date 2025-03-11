import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ["kingfish-relieved-steadily.ngrok-free.app"],
  },
});
