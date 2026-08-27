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
  IonToast,
  IonButtons,
  IonBackButton
} from "@ionic/react";
import { useAuth } from "@/context/AuthContext";
import { crearCredito } from "@/api/creditos";
import { ApiError } from "@/api/client";
import type { CreditoCreateInput } from "@/types/credito";

type FormState = {
  nombreCliente: string;
  cedula: string;
  valorCredito: string;
  tasaInteres: string;
  plazoMeses: string;
  nombreComercial: string;
};

const initialState: FormState = {
  nombreCliente: "",
  cedula: "",
  valorCredito: "",
  tasaInteres: "",
  plazoMeses: "",
  nombreComercial: ""
};

function validar(form: FormState): Partial<Record<keyof FormState, string>> {
  const errores: Partial<Record<keyof FormState, string>> = {};

  if (form.nombreCliente.trim().length < 2) {
    errores.nombreCliente = "El nombre del cliente es obligatorio.";
  }
  if (!/^[A-Za-z0-9-]{4,30}$/.test(form.cedula.trim())) {
    errores.cedula = "La cédula debe tener entre 4 y 30 caracteres (letras, números o guiones).";
  }
  const valor = Number(form.valorCredito);
  if (!form.valorCredito || Number.isNaN(valor) || valor <= 0) {
    errores.valorCredito = "El valor del crédito debe ser un número mayor a 0.";
  }
  const tasa = Number(form.tasaInteres);
  if (form.tasaInteres === "" || Number.isNaN(tasa) || tasa < 0 || tasa > 100) {
    errores.tasaInteres = "La tasa de interés debe estar entre 0 y 100.";
  }
  const plazo = Number(form.plazoMeses);
  if (!form.plazoMeses || !Number.isInteger(plazo) || plazo <= 0) {
    errores.plazoMeses = "El plazo en meses debe ser un entero mayor a 0.";
  }
  if (form.nombreComercial.trim().length < 2) {
    errores.nombreComercial = "El nombre del comercial es obligatorio.";
  }

  return errores;
}

export default function RegistrarCreditoPage() {
  const { token } = useAuth();
  const [form, setForm] = useState<FormState>(initialState);
  const [errores, setErrores] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastColor, setToastColor] = useState<"success" | "danger">("success");

  function setField<K extends keyof FormState>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const erroresValidacion = validar(form);
    setErrores(erroresValidacion);
    if (Object.keys(erroresValidacion).length > 0) {
      return;
    }

    const input: CreditoCreateInput = {
      nombreCliente: form.nombreCliente.trim(),
      cedula: form.cedula.trim(),
      valorCredito: Number(form.valorCredito),
      tasaInteres: Number(form.tasaInteres),
      plazoMeses: Number(form.plazoMeses),
      nombreComercial: form.nombreComercial.trim()
    };

    setSubmitting(true);
    try {
      await crearCredito(input, token);
      setToastColor("success");
      setToastMessage("Crédito registrado. El correo de notificación se envía en segundo plano.");
      setForm(initialState);
      setErrores({});
    } catch (err) {
      setToastColor("danger");
      setToastMessage(err instanceof ApiError ? err.message : "No se pudo registrar el crédito.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/creditos/consultar" />
          </IonButtons>
          <IonTitle>Registrar crédito</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <form onSubmit={handleSubmit}>
          <IonItem>
            <IonLabel position="stacked">Nombre del cliente</IonLabel>
            <IonInput
              value={form.nombreCliente}
              onIonInput={(e) => setField("nombreCliente", e.detail.value ?? "")}
            />
          </IonItem>
          {errores.nombreCliente && <ErrorText texto={errores.nombreCliente} />}

          <IonItem>
            <IonLabel position="stacked">Cédula o ID</IonLabel>
            <IonInput
              value={form.cedula}
              onIonInput={(e) => setField("cedula", e.detail.value ?? "")}
            />
          </IonItem>
          {errores.cedula && <ErrorText texto={errores.cedula} />}

          <IonItem>
            <IonLabel position="stacked">Valor del crédito</IonLabel>
            <IonInput
              type="number"
              inputmode="decimal"
              value={form.valorCredito}
              onIonInput={(e) => setField("valorCredito", e.detail.value ?? "")}
            />
          </IonItem>
          {errores.valorCredito && <ErrorText texto={errores.valorCredito} />}

          <IonItem>
            <IonLabel position="stacked">Tasa de interés (%)</IonLabel>
            <IonInput
              type="number"
              inputmode="decimal"
              value={form.tasaInteres}
              onIonInput={(e) => setField("tasaInteres", e.detail.value ?? "")}
            />
          </IonItem>
          {errores.tasaInteres && <ErrorText texto={errores.tasaInteres} />}

          <IonItem>
            <IonLabel position="stacked">Plazo en meses</IonLabel>
            <IonInput
              type="number"
              inputmode="numeric"
              value={form.plazoMeses}
              onIonInput={(e) => setField("plazoMeses", e.detail.value ?? "")}
            />
          </IonItem>
          {errores.plazoMeses && <ErrorText texto={errores.plazoMeses} />}

          <IonItem>
            <IonLabel position="stacked">Comercial que registra el crédito</IonLabel>
            <IonInput
              value={form.nombreComercial}
              onIonInput={(e) => setField("nombreComercial", e.detail.value ?? "")}
            />
          </IonItem>
          {errores.nombreComercial && <ErrorText texto={errores.nombreComercial} />}

          <IonButton expand="block" type="submit" className="ion-margin-top" disabled={submitting}>
            {submitting ? "Registrando..." : "Registrar"}
          </IonButton>
        </form>

        <IonToast
          isOpen={toastMessage !== null}
          message={toastMessage ?? ""}
          duration={3500}
          color={toastColor}
          onDidDismiss={() => setToastMessage(null)}
        />
      </IonContent>
    </IonPage>
  );
}

function ErrorText({ texto }: { texto: string }) {
  return (
    <IonText color="danger">
      <p className="ion-padding-start" style={{ fontSize: "0.85rem", margin: "2px 0 8px" }}>
        {texto}
      </p>
    </IonText>
  );
}
