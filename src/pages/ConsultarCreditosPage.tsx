import React, { useCallback, useEffect, useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSearchbar,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonButtons,
  IonButton,
  IonIcon,
  IonSpinner,
  IonText,
  IonGrid,
  IonRow,
  IonCol,
  IonRefresher,
  IonRefresherContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  useIonRouter
} from "@ionic/react";
import { logOutOutline, addOutline } from "ionicons/icons";
import { useAuth } from "@/context/AuthContext";
import { listarCreditos } from "@/api/creditos";
import { ApiError } from "@/api/client";
import type { Credito, CreditoSortBy, SortOrder } from "@/types/credito";

const formatoMoneda = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });
const formatoFecha = new Intl.DateTimeFormat("es-CO", { dateStyle: "medium", timeStyle: "short" });

export default function ConsultarCreditosPage() {
  const { token, logout } = useAuth();
  const router = useIonRouter();

  const [nombre, setNombre] = useState("");
  const [cedula, setCedula] = useState("");
  const [comercial, setComercial] = useState("");
  const [sortBy, setSortBy] = useState<CreditoSortBy>("fecha");
  const [order, setOrder] = useState<SortOrder>("desc");

  const [creditos, setCreditos] = useState<Credito[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const resultado = await listarCreditos(
        { nombre, cedula, comercial, sortBy, order, page: 1, pageSize: 50 },
        token
      );
      setCreditos(resultado.items);
      setTotalCount(resultado.totalCount);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudieron cargar los créditos.");
    } finally {
      setLoading(false);
    }
  }, [nombre, cedula, comercial, sortBy, order, token]);

  useEffect(() => {
    const timeout = setTimeout(cargar, 300); // debounce simple para los filtros de texto
    return () => clearTimeout(timeout);
  }, [cargar]);

  async function handleLogout() {
    await logout();
    router.push("/login", "none", "replace");
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Créditos registrados</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => router.push("/creditos/registrar", "forward")}>
              <IonIcon slot="icon-only" icon={addOutline} />
            </IonButton>
            <IonButton onClick={handleLogout}>
              <IonIcon slot="icon-only" icon={logOutOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonRefresher slot="fixed" onIonRefresh={async (e) => { await cargar(); e.detail.complete(); }}>
          <IonRefresherContent />
        </IonRefresher>

        <IonSearchbar
          placeholder="Filtrar por nombre del cliente"
          value={nombre}
          onIonInput={(e) => setNombre(e.detail.value ?? "")}
          debounce={0}
        />
        <IonSearchbar
          placeholder="Filtrar por cédula"
          value={cedula}
          onIonInput={(e) => setCedula(e.detail.value ?? "")}
          debounce={0}
        />
        <IonSearchbar
          placeholder="Filtrar por comercial"
          value={comercial}
          onIonInput={(e) => setComercial(e.detail.value ?? "")}
          debounce={0}
        />

        <IonGrid>
          <IonRow>
            <IonCol size="6">
              <IonItem>
                <IonLabel>Ordenar por</IonLabel>
                <IonSelect
                  value={sortBy}
                  onIonChange={(e) => setSortBy(e.detail.value as CreditoSortBy)}
                >
                  <IonSelectOption value="fecha">Fecha de registro</IonSelectOption>
                  <IonSelectOption value="valor">Valor del crédito</IonSelectOption>
                </IonSelect>
              </IonItem>
            </IonCol>
            <IonCol size="6">
              <IonItem>
                <IonLabel>Orden</IonLabel>
                <IonSelect value={order} onIonChange={(e) => setOrder(e.detail.value as SortOrder)}>
                  <IonSelectOption value="desc">Descendente</IonSelectOption>
                  <IonSelectOption value="asc">Ascendente</IonSelectOption>
                </IonSelect>
              </IonItem>
            </IonCol>
          </IonRow>
        </IonGrid>

        {loading && (
          <div className="ion-text-center ion-padding">
            <IonSpinner name="dots" />
          </div>
        )}

        {error && (
          <IonText color="danger">
            <p>{error}</p>
          </IonText>
        )}

        {!loading && !error && creditos.length === 0 && (
          <IonText color="medium">
            <p className="ion-text-center">No hay créditos que coincidan con el filtro.</p>
          </IonText>
        )}

        {!loading && creditos.length > 0 && (
          <>
            <p style={{ color: "var(--ion-color-medium)" }}>
              Mostrando {creditos.length} de {totalCount} crédito(s)
            </p>
            <div className="creditos-list">
              {creditos.map((c) => (
                <IonCard key={c.id} style={{ marginBottom: "16px", borderRadius: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", marginInline: "0" }}>
                  <IonCardHeader>
                    <IonCardSubtitle>C.C. {c.cedula}</IonCardSubtitle>
                    <IonCardTitle>{c.nombreCliente}</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <IonGrid className="ion-no-padding">
                      <IonRow>
                        <IonCol size="6">
                          <p><strong>Valor:</strong> {formatoMoneda.format(c.valorCredito)}</p>
                          <p><strong>Tasa:</strong> {c.tasaInteres}%</p>
                        </IonCol>
                        <IonCol size="6">
                          <p><strong>Plazo:</strong> {c.plazoMeses} meses</p>
                          <p><strong>Comercial:</strong> {c.nombreComercial}</p>
                        </IonCol>
                      </IonRow>
                      <IonRow style={{ marginTop: "12px" }}>
                        <IonCol>
                          <IonText color="medium">
                            <small>Registrado el {formatoFecha.format(new Date(c.fechaRegistro))}</small>
                          </IonText>
                        </IonCol>
                      </IonRow>
                    </IonGrid>
                  </IonCardContent>
                </IonCard>
              ))}
            </div>
          </>
        )}
      </IonContent>
    </IonPage>
  );
}
