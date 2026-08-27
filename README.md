# Fya Créditos — Frontend (Ionic + React + Capacitor)

App para registrar y consultar créditos, construida para el examen técnico
`GH-CTP-I+D-ET-01` de Fya Social Capital. Corre como web y se empaqueta a
Android (.apk / .aab) con Capacitor — es la combinación que realmente
genera un APK, a diferencia de un React o Angular "puro".

Repositorio hermano: `fya-creditos-backend` (API .NET que consume esta app).

## Stack

- **Ionic React 7** + **React Router v5** (vía `@ionic/react-router`)
- **Vite** + **TypeScript**
- **Capacitor** (Android) + `@capacitor/preferences` para guardar el JWT

## Estructura

```
src/
  api/            client.ts (fetch wrapper), auth.ts, creditos.ts
  context/        AuthContext (guarda el JWT con Capacitor Preferences)
  components/     ProtectedRoute
  pages/          LoginPage, RegistrarCreditoPage, ConsultarCreditosPage
  types/          Credito, CreditoQuery, PagedResult
  theme/          variables.css (colores de Ionic)
.github/workflows/
  frontend-ci.yml    build web (npm ci && npm run build)
  android-build.yml  genera el .apk (debug) y el .aab (release sin firmar)
```

La carpeta `android/` (proyecto nativo de Capacitor) se genera con `npx cap add android`. El
workflow `android-build.yml` la genera automáticamente en CI si no existe;
localmente, corre `npm run cap:add:android` una vez (ver abajo).

## Cómo correrlo

```bash
npm install
cp .env.example .env
# edita .env con la URL de tu backend (ver fya-creditos-backend)

npm run dev        # http://localhost:8100, contra el backend en VITE_API_BASE_URL
npm run build       # build de producción en dist/
```

### Generar el APK/AAB de Android

**Automático (recomendado):** el workflow `android-build.yml` se ejecuta
en cada push y sube el `.apk` de debug y el `.aab` de release (sin firmar)
como *artifacts* descargables desde la pestaña "Actions" de GitHub.

**Local**, si tienes Android Studio / el SDK de Android instalado:

```bash
npm install
npm run build
npm run cap:add:android      # solo la primera vez, crea la carpeta android/
npm run cap:sync             # cada vez que cambies código o config nativa
cd android
./gradlew assembleDebug      # genera app/build/outputs/apk/debug/app-debug.apk
./gradlew bundleRelease      # genera app/build/outputs/bundle/release/app-release.aab
```

### 📦 Dónde está el APK
El archivo ejecutable listo para instalar en Android se encuentra en este mismo repositorio en la ruta:
`releases/fya-creditos-app.apk`

El `.aab` de release sale **sin firmar** (Gradle lo genera igual); para
publicarlo en Play Store necesitas firmarlo con tu propio keystore. Para
la entrega del examen, el `.apk` de debug ya es instalable directamente.

### Usuario de prueba

El login pega contra `POST /api/auth/login` del backend. Usa el usuario
que hayas configurado ahí (`AuthCredentials__Username` / `PasswordHash`,
ver el README del backend) — por defecto `admin` + la contraseña que
elijas al generar el hash con `tools/generate_password_hash.py`.

## Variables de entorno

| Variable              | Descripción                                                        |
|------------------------|---------------------------------------------------------------------|
| `VITE_API_BASE_URL`   | URL base del backend. En el emulador de Android, `localhost` es el propio emulador — usa `10.0.2.2` o la IP de tu máquina en la red. |

## Validación en frontend

`RegistrarCreditoPage` valida cliente-side antes de llamar a la API
(nombre y comercial no vacíos, cédula con formato válido, valor > 0, tasa
entre 0-100, plazo entero > 0) — coincide con las mismas reglas que valida
el backend (`CreditoCreateDto`), así el usuario recibe el error
inmediatamente sin esperar al round-trip cuando es un error obvio, y el
backend queda como última línea de defensa real.

## Entregable / checklist contra el examen

- [x] Formulario de registro con los 6 campos mínimos + botón "Registrar".
- [x] Consulta con tabla, filtros (nombre, cédula, comercial) y orden (fecha, valor).
- [x] UI funcional y clara (Ionic).
- [x] Empaquetado a `.apk`/`.aab` vía Capacitor + GitHub Actions.
- [x] Login que protege el registro (JWT contra el backend).
