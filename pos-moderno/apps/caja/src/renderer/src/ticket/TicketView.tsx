import { useEffect, useState } from 'react';
import { Camera, Save } from 'lucide-react';
import {
  actualizarEmpresa,
  guardarTicket,
  obtenerTicket,
  obtenerEmpresa,
} from '../api';
import {
  DISENO_DEFAULT,
  VENTA_EJEMPLO,
  type DisenoComprobante,
  type FormatoComprobante,
} from './comprobante';
import { TicketComprobante } from './TicketComprobante';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';

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

const CAMPOS: Array<[keyof DisenoComprobante, string]> = [
  ['identificadorFiscal', 'RUC / Identificador fiscal'],
  ['direccion', 'Dirección (calle, nro, avenida)'],
  ['provinciaDepartamentoPais', 'Provincia - Departamento - País'],
  ['nombreDeMoneda', 'Nombre de la moneda'],
  ['agradecimiento', 'Mensaje de agradecimiento'],
  ['paginaWebFacebook', 'Página web / Facebook'],
  ['anuncio', 'Anuncio'],
];

export function TicketView(): JSX.Element {
  const [diseno, setDiseno] = useState<DisenoComprobante>(DISENO_DEFAULT);
  const [empresa, setEmpresa] = useState('NOMBRE DE TU EMPRESA');
  const [empresaId, setEmpresaId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    obtenerTicket()
      .then((d) => setDiseno(aDiseno((d as Record<string, unknown>) ?? {})))
      .catch((e: Error) => setError(e.message));
    obtenerEmpresa()
      .then((e) => {
        if (e?.idEmpresa) setEmpresaId(e.idEmpresa);
        if (e?.nombreEmpresa) setEmpresa(e.nombreEmpresa);
      })
      .catch(() => undefined);
  }, []);

  function set<K extends keyof DisenoComprobante>(k: K, v: DisenoComprobante[K]): void {
    setDiseno((p) => ({ ...p, [k]: v }));
    setMsg(null);
  }

  function subirLogo(e: React.ChangeEvent<HTMLInputElement>): void {
    const f = e.target.files?.[0];
    if (!f || !f.type.startsWith('image/')) return;
    const r = new FileReader();
    r.onload = () => set('logo', String(r.result));
    r.readAsDataURL(f);
  }

  async function guardar(): Promise<void> {
    setError(null);
    try {
      await guardarTicket(diseno as unknown as Record<string, unknown>);
      if (empresaId) await actualizarEmpresa(empresaId, { nombreEmpresa: empresa });
      setMsg('Diseño del comprobante guardado. Aparecerá en el ticket de cada venta.');
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <div className="flex min-h-full flex-wrap items-start gap-6 bg-background p-5">
      <div className="flex justify-center">
        <TicketComprobante diseno={diseno} venta={{ ...VENTA_EJEMPLO, empresa }} />
      </div>

      <Card className="flex w-full max-w-md flex-col gap-4 p-5">
        <h2 className="text-xl font-bold">Diseño de Comprobantes</h2>
        {error && <Alert variant="error">{error}</Alert>}
        {msg && <Alert variant="success">{msg}</Alert>}

        <p className="text-sm text-muted-foreground">
          Elige un formato de comprobante con el que trabajarás
        </p>
        <div className="flex gap-3">
          <Button
            type="button"
            className="flex-1"
            variant={diseno.formato === 'TICKET' ? 'default' : 'outline'}
            onClick={() => set('formato', 'TICKET')}
          >
            Ticket No Fiscal
          </Button>
          <Button
            type="button"
            className="flex-1"
            variant={diseno.formato === 'FACTURA' ? 'default' : 'outline'}
            onClick={() => set('formato', 'FACTURA')}
          >
            Factura - Boleta
          </Button>
        </div>

        <Button variant="outline" asChild>
          <label className="cursor-pointer">
            <Camera /> {diseno.logo ? 'Cambiar logo' : 'Subir logo'}
            <input type="file" accept="image/*" hidden onChange={subirLogo} />
          </label>
        </Button>

        <div className="flex flex-col gap-3">
          <div className="grid gap-1.5">
            <Label>Nombre del negocio</Label>
            <Input
              value={empresa}
              placeholder="Mi Negocio S.A."
              onChange={(e) => {
                setEmpresa(e.target.value);
                setMsg(null);
              }}
            />
          </div>
          {CAMPOS.map(([k, label]) => (
            <div key={k} className="grid gap-1.5">
              <Label>{label}</Label>
              <Input value={diseno[k]} onChange={(e) => set(k, e.target.value as never)} />
            </div>
          ))}
          {diseno.formato === 'FACTURA' && (
            <div className="grid gap-1.5">
              <Label>Datos fiscales (autorización, resolución…)</Label>
              <Input
                value={diseno.datosFiscales}
                onChange={(e) => set('datosFiscales', e.target.value)}
              />
            </div>
          )}
        </div>

        <Button onClick={guardar}>
          <Save /> Guardar
        </Button>
      </Card>
    </div>
  );
}
