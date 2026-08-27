import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.fyasocialcapital.creditos",
  appName: "Fya Créditos",
  webDir: "dist",
  server: {
    // Durante desarrollo contra un backend en tu red local, puedes apuntar
    // aquí a la IP de tu máquina (no localhost, el emulador/dispositivo no
    // la resuelve) y descomentar. En producción se deja sin "server" y la
    // app usa el bundle empaquetado (dist/) + VITE_API_BASE_URL.
    // url: "http://192.168.1.100:8100",
    // cleartext: true
    androidScheme: "https"
  }
};

export default config;
