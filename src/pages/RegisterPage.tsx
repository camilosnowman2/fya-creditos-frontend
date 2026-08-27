import React, { useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonText,
  useIonRouter
} from "@ionic/react";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/api/client";

export default function RegisterPage() {
  const { login } = useAuth();
  const router = useIonRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password) {
      setError("Usuario y contraseña son obligatorios.");
      return;
    }

    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setSubmitting(true);
    try {
      const API_BASE_URL = (import.meta as any).env.VITE_API_BASE_URL ?? "http://localhost:5000";
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        const msg = data?.title ?? data?.detail ?? `Error ${response.status} al registrar.`;
        throw new ApiError(msg, response.status);
      }

      const { token, expiresAtUtc } = await response.json();
      await login(token, expiresAtUtc);
      router.push("/creditos/consultar", "forward", "replace");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo registrar.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Registro — Fya Créditos</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <form onSubmit={handleSubmit}>
          <IonItem>
            <IonLabel position="stacked">Usuario</IonLabel>
            <IonInput
              value={username}
              onIonInput={(e) => setUsername(e.detail.value ?? "")}
              autocapitalize="off"
              autocomplete="username"
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Contraseña</IonLabel>
            <IonInput
              type="password"
              value={password}
              onIonInput={(e) => setPassword(e.detail.value ?? "")}
              autocomplete="new-password"
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Confirmar contraseña</IonLabel>
            <IonInput
              type="password"
              value={confirm}
              onIonInput={(e) => setConfirm(e.detail.value ?? "")}
              autocomplete="new-password"
            />
          </IonItem>

          {error && (
            <IonText color="danger">
              <p className="ion-padding-top">{error}</p>
            </IonText>
          )}

          <IonButton expand="block" type="submit" className="ion-margin-top" disabled={submitting}>
            {submitting ? "Registrando..." : "Crear cuenta"}
          </IonButton>

          <IonButton expand="block" fill="clear" routerLink="/login" className="ion-margin-top">
            Ya tengo cuenta — Iniciar sesión
          </IonButton>
        </form>
      </IonContent>
    </IonPage>
  );
}
