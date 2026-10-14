import { useEffect, useState } from 'react';
import { CheckCircle2, AlertTriangle, Link2 } from 'lucide-react';
import {
  desvincularTerminal,
  dispositivosTerminal,
  guardarTerminal,
  modoTerminal,
  obtenerTerminal,
  urlOauthTerminal,
  type TerminalConfig,
} from '../api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export function TerminalMPView(): JSX.Element {
  const [cfg, setCfg] = useState<TerminalConfig | null>(null);
  const [accessToken, setAccessToken] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [storeId, setStoreId] = useState('');
  const [enabled, setEnabled] = useState(false);
  const [simulacion, setSimulacion] = useState(true);
  const [devices, setDevices] = useState<
    Array<{ id: string; name: string; operating_mode?: string; store_id?: string; pos_id?: string }>
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    obtenerTerminal()
      .then((c) => {
        setCfg(c);
        setDeviceId(c.deviceId);
        setStoreId(c.storeId);
        setEnabled(c.enabled);
        setSimulacion(c.simulacion);
      })
      .catch((e: Error) => setError(e.message));
  }, []);

  async function guardar(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setError(null);
    try {
      const c = await guardarTerminal({
        enabled,
        simulacion,
        deviceId,
        storeId,
        ...(accessToken ? { accessToken } : {}),
      });
      setCfg(c);
      setAccessToken('');
      setMsg('Configuración de terminal guardada.');
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function probar(): Promise<void> {
    setError(null);
    try {
      setDevices(await dispositivosTerminal());
      setMsg('Dispositivos obtenidos.');
    } catch (err) {
      setError((err as Error).message);
    }
  }

  function conectar(): void {
    window.open(urlOauthTerminal(), '_blank');
    setMsg('Se abrió Mercado Pago en el navegador. Autoriza y vuelve aquí…');
    let n = 0;
    const id = window.setInterval(async () => {
      n++;
      try {
        const c = await obtenerTerminal();
        if (c.conectado) {
          setCfg(c);
          setMsg('✔ Cuenta de Mercado Pago conectada.');
          clearInterval(id);
        }
      } catch {
        /* reintentar */
      }
      if (n > 40) clearInterval(id);
    }, 2000);
  }

  async function desconectar(): Promise<void> {
    try {
      const c = await desvincularTerminal();
      setCfg(c);
      setMsg('Cuenta desvinculada.');
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function ponerModoPDV(id: string): Promise<void> {
    setError(null);
    try {
      await modoTerminal(id, 'PDV');
      setMsg(`Terminal ${id} puesta en modo integrado (PDV).`);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <main className="mx-auto max-w-[620px] p-5">
      <h2 className="mb-3 text-xl font-bold">Terminal — Mercado Pago</h2>
      {error && <Alert variant="error" className="mb-3">{error}</Alert>}
      {msg && <Alert variant="success" className="mb-3">{msg}</Alert>}

      <div className="mb-4 rounded-md border border-primary/30 bg-primary/5 p-4 text-sm">
        <strong>¿Cómo configurar tu terminal?</strong>
        <ol className="my-2 list-decimal space-y-1 pl-5">
          <li>
            Crea una aplicación en el panel de Mercado Pago (tipo “Pagos presenciales / Point”):{' '}
            <a className="text-primary underline" href="https://www.mercadopago.com/developers/panel/app" target="_blank" rel="noreferrer">
              Abrir panel de Mercado Pago ↗
            </a>
          </li>
          <li>
            En <em>Credenciales</em> copia el <strong>Access Token</strong> (producción
            <code> APP_USR-… </code>) y pégalo abajo. Luego pulsa <strong>Guardar</strong>.
          </li>
          <li>
            Pulsa <strong>Probar dispositivos</strong> para listar tus terminales y elige
            <strong> “Usar”</strong>. (Tu terminal debe estar comprada y asociada a tu cuenta MP.)
          </li>
          <li>
            Pulsa <strong>“Modo integrado (PDV)”</strong> en tu terminal para que reciba cobros
            desde el sistema.
          </li>
          <li>
            Marca <strong>Habilitar cobro con terminal</strong> y desactiva
            <strong> Simulación</strong>.
          </li>
        </ol>
        <div className="flex flex-wrap gap-4">
          <a className="text-primary underline" href="https://www.mercadopago.com/developers/es/docs/mp-point/landing" target="_blank" rel="noreferrer">📄 Documentación Mercado Pago Point ↗</a>
          <a className="text-primary underline" href="https://www.mercadopago.com/developers/panel/app" target="_blank" rel="noreferrer">🔑 Obtener Access Token ↗</a>
        </div>
        <div className="mt-3 border-t border-primary/30 pt-2">
          <strong>Si ves errores de Mercado Pago:</strong>
          <ul className="my-1.5 list-disc space-y-1 pl-5">
            <li><em>“Device is not allowed to perform this action”</em>: tu equipo no permite cambiar el modo por API. Ponlo en <strong>modo Integrado/Punto de venta desde la propia terminal</strong> (Configuración → Modo de operación → Integrado/PDV).</li>
            <li><em>“device and site configuration not found”</em>: la terminal <strong>no está asociada a una Sucursal y Caja</strong>. En tu cuenta MP crea <strong>Sucursal</strong> y <strong>Caja (punto de venta)</strong> y asócia la terminal. En la tabla de abajo la columna “Sucursal/Caja” debe dejar de decir “sin asociar”.</li>
          </ul>
          <a className="text-primary underline" href="https://www.mercadopago.com/developers/es/docs/mp-point/integration-configuration/integration-via-pdv" target="_blank" rel="noreferrer">📄 Configurar PDV / Sucursal y Caja ↗</a>
        </div>
      </div>

      <Card className="mb-4 flex flex-wrap items-center gap-4 p-4">
        {cfg?.conectado && cfg.real ? (
          <>
            <span className="flex items-center gap-1.5 font-bold text-success">
              <CheckCircle2 className="size-4" /> Cuenta conectada {cfg.cuenta ? `(${cfg.cuenta})` : ''}
            </span>
            <Button variant="ghost" type="button" onClick={() => void desconectar()}>
              Desvincular
            </Button>
          </>
        ) : cfg?.conectado && !cfg.real ? (
          <>
            <span className="flex items-center gap-1.5 font-bold text-primary">
              <AlertTriangle className="size-4" /> Conexión SIMULADA — pega tu Access Token REAL (APP_USR-…) abajo para producción.
            </span>
            <Button variant="ghost" type="button" onClick={() => void desconectar()}>
              Desvincular
            </Button>
          </>
        ) : (
          <>
            <Button type="button" onClick={conectar} style={{ background: '#00b1ea' }} className="text-white hover:opacity-90">
              <Link2 /> Conectar con Mercado Pago
            </Button>
            <span className="text-muted-foreground">Vincula tu cuenta sin pegar el token a mano.</span>
          </>
        )}
      </Card>

      <Card className="mb-4">
        <form className="flex flex-col gap-3 p-4" onSubmit={guardar}>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={enabled} onCheckedChange={(v) => setEnabled(Boolean(v))} /> Habilitar cobro con terminal
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={simulacion} onCheckedChange={(v) => setSimulacion(Boolean(v))} /> Modo simulación (sin hardware real)
          </label>
          <div className="flex items-center gap-3">
            <Label className="w-[150px] shrink-0">Access Token</Label>
            <Input
              type="password"
              className="flex-1"
              placeholder={cfg?.tokenConfigurado ? '•••••• (guardado)' : 'APP_USR-...'}
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <Label className="w-[150px] shrink-0">Device ID</Label>
            <Input className="flex-1" value={deviceId} onChange={(e) => setDeviceId(e.target.value)} placeholder="PAX_A910__..." />
          </div>
          <div className="flex items-center gap-3">
            <Label className="w-[150px] shrink-0">Store ID (opcional)</Label>
            <Input className="flex-1" value={storeId} onChange={(e) => setStoreId(e.target.value)} />
          </div>
          <div className="flex gap-3">
            <Button type="submit">Guardar</Button>
            <Button variant="outline" type="button" onClick={() => void probar()}>Probar dispositivos</Button>
          </div>
        </form>
      </Card>

      {devices.length > 0 && (
        <Table className="mt-3">
          <TableHeader>
            <TableRow>
              <TableHead>ID del dispositivo</TableHead><TableHead>Modo</TableHead><TableHead>Sucursal/Caja</TableHead><TableHead></TableHead><TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {devices.map((d) => (
              <TableRow key={d.id}>
                <TableCell>{d.id}{deviceId === d.id ? ' ✓' : ''}</TableCell>
                <TableCell>{d.operating_mode || '—'}</TableCell>
                <TableCell>{d.store_id || d.pos_id ? `${d.store_id || '—'} / ${d.pos_id || '—'}` : '⚠ sin asociar'}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" onClick={() => setDeviceId(d.id)}>Usar</Button>
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" onClick={() => void ponerModoPDV(d.id)}>Poner en PDV</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <p className="mt-3 text-muted-foreground">
        En modo simulación los cobros se aprueban automáticamente (para pruebas sin
        terminal física). Para producción, desactiva simulación y configura tu Access
        Token y Device ID de Mercado Pago Point.
      </p>
    </main>
  );
}
