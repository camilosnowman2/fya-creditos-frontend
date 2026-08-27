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

export default function LoginPage() {
  const { login } = useAuth();
  const router = useIonRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password) {
      setError("Usuario y contraseña son obligatorios.");
      return;
    }

    setSubmitting(true);
    try {
      await login(username.trim(), password);
      router.push("/creditos/consultar", "forward", "replace");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo iniciar sesión.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Fya Créditos</IonTitle>
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
              autocomplete="current-password"
            />
          </IonItem>

          {error && (
            <IonText color="danger">
              <p className="ion-padding-top">{error}</p>
            </IonText>
          )}

          <IonButton expand="block" type="submit" className="ion-margin-top" disabled={submitting}>
            {submitting ? "Ingresando..." : "Ingresar"}
          </IonButton>

          <IonButton expand="block" fill="clear" routerLink="/register" className="ion-margin-top">
            No tengo cuenta — Registrarme
          </IonButton>
        </form>
      </IonContent>
    </IonPage>
  );
}
