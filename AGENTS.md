# AGENTS.md — fya-creditos-frontend

## Descripción general

Aplicación frontend (móvil/web) para el registro y consulta de créditos financieros de **Fya Créditos**, desarrollada con **Ionic**, **React** y **Capacitor**. Se conecta a la API REST del backend (`fya-creditos-backend`) para la gestión de datos.

---

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Framework UI | Ionic Framework |
| Librería Core | React |
| Empaquetado nativo | Capacitor |
| Despliegue web | Railway |
| CI/CD | GitHub Actions (build de APK y Web) |

---

## Arquitectura y estructura de carpetas

```
fya-creditos-frontend/
├── src/
│   ├── components/       # Componentes UI reutilizables
│   ├── pages/            # Páginas de la app (Login, Registro, Consultar, etc.)
│   ├── services/         # Lógica de llamadas a la API (fetch/axios)
│   ├── context/          # Estado global (ej. AuthContext)
│   └── theme/            # Variables de estilo (variables.css)
├── android/              # Proyecto nativo generado por Capacitor
├── releases/             # Binarios compilados (APK)
├── .env.example          # Variables de entorno requeridas
└── vite.config.ts        # Configuración del bundler
```

---

## Enlaces del proyecto

- **Aplicación Web en vivo**: [https://fya-creditos-frontend-production.up.railway.app/](https://fya-creditos-frontend-production.up.railway.app/)
- **Aplicación Android (APK)**: Puedes descargar el instalador compilado desde la carpeta `releases/fya-creditos-app.apk`.

---

## Cómo correr el proyecto (Local)

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env
# Asegurarse de que VITE_API_URL apunte al backend (ej. http://localhost:5000/api)

# 3. Levantar servidor de desarrollo
npm run dev
```

La aplicación estará disponible típicamente en `http://localhost:8100`.

> **Nota sobre el registro:** El sistema permite el libre registro de usuarios. Para probar la app, utiliza la opción "Registrarme" en la pantalla de login para crear tu usuario.

---

## Convenciones para agentes / asistentes de código

- **Estilos:** Se utilizan las clases utilitarias y componentes de Ionic. Evitar agregar CSS personalizado innecesario a menos que Ionic no lo soporte.
- **Estado:** Utilizar los contextos globales existentes antes de crear nuevos.
- **Rutas API:** Las llamadas al backend deben usar la variable de entorno `VITE_API_URL`. No hardcodear URLs absolutas.
- **Capacitor:** Si se agregan plugins nativos de Capacitor, recordar ejecutar `npx cap sync android` después de instalar el paquete npm.

---

## Notas para el evaluador

- El proyecto cuenta con un flujo CI en GitHub Actions que compila la versión web y genera el `.aab` para Android.
- El archivo APK funcional está pre-compilado en el repositorio (`releases/fya-creditos-app.apk`) para facilitar la revisión en dispositivos Android sin necesidad de compilar localmente.
