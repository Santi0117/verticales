import { redirect } from "next/navigation";
import { urlDeActivacion } from "@/lib/activacion";

type Props = {
  searchParams: Promise<{ vertical?: string }>;
};

/**
 * Tras pagar en Onvo: mandamos al registro de la app del vertical
 * con billing=activa.
 */
export default async function ActivarExitoPage({ searchParams }: Props) {
  const params = await searchParams;
  const verticalId = params.vertical?.trim();

  if (!verticalId) {
    redirect("/activar?pago=error");
  }

  const destino = urlDeActivacion(verticalId, "unico", { billing: "activa" });

  if (!destino) {
    redirect(
      `/activar?vertical=${encodeURIComponent(verticalId)}&pago=error`,
    );
  }

  redirect(destino);
}
