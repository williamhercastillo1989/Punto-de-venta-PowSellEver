import { useEffect, useState } from 'react';
import { Printer, ShoppingCart } from 'lucide-react';
import { obtenerTicket } from '../api';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
  DISENO_DEFAULT,
  type DisenoComprobante,
  type FormatoComprobante,
  type VentaComprobante,
} from '../ticket/comprobante';
import { TicketComprobante } from '../ticket/TicketComprobante';

/** Datos que la venta entrega para pintar el comprobante. */
export type TicketData = VentaComprobante;

function aDiseno(d: Record<string, unknown>): DisenoComprobante {
  const s = (k: string, def: string): string => {
    const v = d[k];
    return typeof v === 'string' && v.trim() ? v : def;
  };
  return {
    formato: (d.formato === 'FACTURA' ? 'FACTURA' : 'TICKET') as FormatoComprobante,
    logo: typeof d.logo === 'string' ? d.logo : '',
    identificadorFiscal: s('identificadorFiscal', DISENO_DEFAULT.identificadorFiscal),
    direccion: s('direccion', DISENO_DEFAULT.direccion),
    provinciaDepartamentoPais: s('provinciaDepartamentoPais', DISENO_DEFAULT.provinciaDepartamentoPais),
    nombreDeMoneda: s('nombreDeMoneda', DISENO_DEFAULT.nombreDeMoneda),
    agradecimiento: s('agradecimiento', DISENO_DEFAULT.agradecimiento),
    paginaWebFacebook: s('paginaWebFacebook', DISENO_DEFAULT.paginaWebFacebook),
    anuncio: s('anuncio', DISENO_DEFAULT.anuncio),
    datosFiscales: s('datosFiscales', DISENO_DEFAULT.datosFiscales),
  };
}

interface Props {
  data: TicketData;
  onNueva: () => void;
}

export function TicketPreview({ data, onNueva }: Props): JSX.Element {
  const [diseno, setDiseno] = useState<DisenoComprobante>(DISENO_DEFAULT);

  useEffect(() => {
    obtenerTicket()
      .then((d) => setDiseno(aDiseno((d as Record<string, unknown>) ?? {})))
      .catch(() => undefined);
  }, []);

  return (
    <Dialog open onOpenChange={(o) => !o && onNueva()}>
      <DialogContent className="max-w-3xl">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="text-[13px] sm:border-r sm:border-dashed sm:pr-4">
            <TicketComprobante diseno={diseno} venta={data} />
          </div>

          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <h2 className="text-xl font-bold text-success">VENTA REALIZADA CORRECTAMENTE</h2>
            <ShoppingCart className="size-16 text-success" />
            <div className="flex w-full flex-col gap-2">
              <Button onClick={() => window.print()}>
                <Printer /> Imprimir / Guardar PDF
              </Button>
              <Button variant="outline" onClick={onNueva}>
                Nueva venta
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
