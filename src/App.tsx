import React from "react";
import { Redirect, Route } from "react-router-dom";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import RegistrarCreditoPage from "@/pages/RegistrarCreditoPage";
import ConsultarCreditosPage from "@/pages/ConsultarCreditosPage";

/* Estilos base de Ionic (requeridos) */
import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

import "@/theme/variables.css";

setupIonicReact();

export default function App() {
  return (
    <IonApp>
      <AuthProvider>
        <IonReactRouter>
          <IonRouterOutlet>
            <Route exact path="/login" component={LoginPage} />
            <Route exact path="/register" component={RegisterPage} />

            <ProtectedRoute exact path="/creditos/registrar">
              <RegistrarCreditoPage />
            </ProtectedRoute>

            <ProtectedRoute exact path="/creditos/consultar">
              <ConsultarCreditosPage />
            </ProtectedRoute>

            <Route exact path="/">
              <Redirect to="/creditos/consultar" />
            </Route>
          </IonRouterOutlet>
        </IonReactRouter>
      </AuthProvider>
    </IonApp>
  );
}
