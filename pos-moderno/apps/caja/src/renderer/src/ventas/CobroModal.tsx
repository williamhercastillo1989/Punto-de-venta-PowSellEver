import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, CheckCircle2, CreditCard, Monitor, Printer, X } from 'lucide-react';
import type { ClienteDTO } from '@pos/types';
import {
  cancelarPagoTerminal,
  estadoPagoTerminal,
  iniciarPagoTerminal,
  obtenerTerminal,
} from '../api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

const SELECT_CLASS =
  'flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring';

export interface DatosCobro {
  modo: 'directo' | 'pantalla';
  efectivo: number;
  tarjeta: number;
  credito: number;
  vuelto: number;
  idCliente?: number;
  tipoDoc: 'BOLETA' | 'FACTURA';
}

interface Props {
  total: number;
  numeroDoc: string;
  clientes: ClienteDTO[];
  onCancelar: () => void;
  onConfirmar: (d: DatosCobro) => void;
}

type Campo = 'efectivo' | 'tarjeta' | 'credito';

export function CobroModal({ total, numeroDoc, clientes, onCancelar, onConfirmar }: Props): JSX.Element {
  const [efectivo, setEfectivo] = useState(total.toFixed(2));
  const [tarjeta, setTarjeta] = useState('0');
  const [credito, setCredito] = useState('0');
  const [campo, setCampo] = useState<Campo>('efectivo');
  const [idCliente, setIdCliente] = useState<number | ''>('');
  const [tipoDoc, setTipoDoc] = useState<'BOLETA' | 'FACTURA'>('BOLETA');
  const [terminalOn, setTerminalOn] = useState(false);
  const [terminalSim, setTerminalSim] = useState(false);
  const [terminalMsg, setTerminalMsg] = useState<string | null>(null);
  const [procesandoTerminal, setProcesandoTerminal] = useState(false);
  const [confirmandoTerminal, setConfirmandoTerminal] = useState(false);
  const [exitoTerminal, setExitoTerminal] = useState(false);
  const intentRef = useRef<string | null>(null);
  const pollRef = useRef<number | null>(null);

  useEffect(() => {
    obtenerTerminal()
      .then((c) => {
        setTerminalOn(c.enabled);
        setTerminalSim(c.simulacion);
      })
      .catch(() => setTerminalOn(false));
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const pagado = (Number(efectivo) || 0) + (Number(tarjeta) || 0) + (Number(credito) || 0);
  const vuelto = Math.max(0, pagado - total);
  const restante = Math.max(0, total - pagado);
  // La terminal cobra exactamente el monto puesto en Tarjeta (tarjeta sola o mixto).
  const montoTerminal = Number(tarjeta) || 0;

  const set = (v: string): void => {
    if (campo === 'efectivo') setEfectivo(v);
    else if (campo === 'tarjeta') setTarjeta(v);
    else setCredito(v);
  };
  const valor = (): string => (campo === 'efectivo' ? efectivo : campo === 'tarjeta' ? tarjeta : credito);
  const tecla = (d: string): void =>
    set(d === ',' ? (valor().includes('.') ? valor() : valor() + '.') : (valor() === '0' ? d : valor() + d));

  function detenerPoll(): void {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    setProcesandoTerminal(false);
  }

  async function cobrarConTerminal(): Promise<void> {
    const monto = montoTerminal; // = monto en Tarjeta
    if (monto <= 0) return;
    setProcesandoTerminal(true);
    setTerminalMsg('Enviando cobro a la terminal…');
    try {
      const { intentId } = await iniciarPagoTerminal(monto);
      intentRef.current = intentId;
      setTerminalMsg('💳 Esperando que el cliente pague en la terminal…');
      pollRef.current = window.setInterval(async () => {
        try {
          const r = await estadoPagoTerminal(intentId);
          if (r.status === 'approved') {
            detenerPoll();
            setTerminalMsg(`✔ Pago con tarjeta aprobado${r.simulado ? ' (simulado)' : ''}.`);
            setExitoTerminal(true);
            intentRef.current = null;
          } else if (r.status === 'canceled' || r.status === 'rejected') {
            detenerPoll();
            setTerminalMsg(`Terminal: pago ${r.status}.`);
            intentRef.current = null;
          }
        } catch {
          /* reintentar en el siguiente tick */
        }
      }, 1500);
    } catch (e) {
      detenerPoll();
      setTerminalMsg((e as Error).message);
    }
  }

  async function cancelarTerminal(): Promise<void> {
    if (intentRef.current) {
      try {
        await cancelarPagoTerminal(intentRef.current);
      } catch {
        /* ignorar */
      }
    }
    detenerPoll();
    intentRef.current = null;
    setTerminalMsg('Cobro con terminal cancelado.');
  }

  function confirmar(modo: 'directo' | 'pantalla'): void {
    onConfirmar({
      modo,
      efectivo: Number(efectivo) || 0,
      tarjeta: Number(tarjeta) || 0,
      credito: Number(credito) || 0,
      vuelto,
      idCliente: idCliente ? Number(idCliente) : undefined,
      tipoDoc,
    });
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent): void {
      if (e.key === 'Enter') { e.preventDefault(); e.stopImmediatePropagation(); confirmar('directo'); }
      else if (e.key === 'F1') { e.preventDefault(); e.stopImmediatePropagation(); confirmar('pantalla'); }
      else if (e.key === 'Escape') { e.preventDefault(); onCancelar(); }
    }
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [efectivo, tarjeta, credito, idCliente, tipoDoc, vuelto]);

  return (
    <>
      <Dialog open onOpenChange={(o) => !o && onCancelar()}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Cobrar · TICKET {numeroDoc}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 md:grid-cols-3">
            {/* Columna izquierda: total y pagos */}
            <div className="flex flex-col gap-3">
              <div className="rounded-lg bg-primary/10 p-4 text-center text-3xl font-bold tabular-nums">
                $ {total.toFixed(2)}
              </div>
              <div className="flex flex-col gap-2">
                <div
                  className={cn(
                    'grid gap-1.5 rounded-md border p-2',
                    campo === 'efectivo' && 'border-primary ring-1 ring-primary',
                  )}
                >
                  <Label>Efectivo:</Label>
                  <Input
                    inputMode="decimal"
                    value={efectivo}
                    onFocus={(e) => { setCampo('efectivo'); e.target.select(); }}
                    onChange={(e) => setEfectivo(e.target.value)}
                  />
                </div>
                <div
                  className={cn(
                    'grid gap-1.5 rounded-md border p-2',
                    campo === 'tarjeta' && 'border-primary ring-1 ring-primary',
                  )}
                >
                  <Label>Tarjeta:</Label>
                  <Input
                    inputMode="decimal"
                    value={tarjeta}
                    onFocus={(e) => { setCampo('tarjeta'); e.target.select(); }}
                    onChange={(e) => setTarjeta(e.target.value)}
                  />
                </div>
                <div
                  className={cn(
                    'grid gap-1.5 rounded-md border p-2',
                    campo === 'credito' && 'border-primary ring-1 ring-primary',
                  )}
                >
                  <Label>Credito:</Label>
                  <Input
                    inputMode="decimal"
                    value={credito}
                    onFocus={(e) => { setCampo('credito'); e.target.select(); }}
                    onChange={(e) => setCredito(e.target.value)}
                  />
                </div>
              </div>
              <div className="text-lg">Vuelto: <strong>{vuelto.toFixed(2)}</strong></div>
              <div className="text-sm text-muted-foreground">Restante: {restante.toFixed(2)}</div>
            </div>

            {/* Columna central: teclado */}
            <div className="grid h-fit grid-cols-3 gap-2">
              {['1','2','3','4','5','6','7','8','9'].map((d) => (
                <Button key={d} variant="outline" onClick={() => tecla(d)}>{d}</Button>
              ))}
              <Button variant="outline" onClick={() => tecla('0')}>0</Button>
              <Button variant="outline" onClick={() => tecla(',')}>,</Button>
              <Button variant="secondary" onClick={() => set('0')}>Borrar</Button>
            </div>

            {/* Columna derecha: acciones */}
            <div className="flex flex-col gap-2">
              <div className="grid gap-1.5">
                <Label>Impresora:</Label>
                <select className={SELECT_CLASS}>
                  <option>Ninguna</option>
                  <option>Predeterminada</option>
                </select>
              </div>
              <Button disabled={restante > 0} onClick={() => confirmar('directo')}>
                <Printer /> Imprimir directo (ENTER)
              </Button>
              <Button variant="secondary" disabled={restante > 0} onClick={() => confirmar('pantalla')}>
                <Monitor /> Guardar y ver en Pantalla (F1)
              </Button>
              {terminalOn && !procesandoTerminal && (
                <Button
                  variant="success"
                  disabled={montoTerminal <= 0}
                  onClick={() => setConfirmandoTerminal(true)}
                >
                  <CreditCard /> Cobrar con Terminal MP
                </Button>
              )}
              {terminalOn && terminalSim && (
                <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
                  <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
                  Modo simulación: aprueba sin usar la terminal física. Desactívalo en
                  Configurar → Terminales para cobros reales.
                </p>
              )}
              {terminalOn && procesandoTerminal && (
                <Button variant="destructive" onClick={() => void cancelarTerminal()}>
                  <X /> Cancelar cobro en terminal
                </Button>
              )}
              {terminalMsg && <Alert variant="info" className="text-sm">{terminalMsg}</Alert>}
              <div className="flex gap-2">
                <Button
                  variant={tipoDoc === 'BOLETA' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => setTipoDoc('BOLETA')}
                >
                  BOLETA
                </Button>
                <Button
                  variant={tipoDoc === 'FACTURA' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => setTipoDoc('FACTURA')}
                >
                  FACTURA
                </Button>
              </div>
              <div className="grid gap-1.5">
                <Label>Cliente: (Opcional)</Label>
                <select
                  className={SELECT_CLASS}
                  value={idCliente}
                  onChange={(e) => setIdCliente(e.target.value ? Number(e.target.value) : '')}
                >
                  <option value="">GENERICO</option>
                  {clientes.map((c) => (<option key={c.idCliente} value={c.idCliente}>{c.nombre}</option>))}
                </select>
              </div>
              <div className="text-sm text-muted-foreground">TICKET {numeroDoc}</div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmandoTerminal} onOpenChange={(o) => !o && setConfirmandoTerminal(false)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Cobrar con Terminal</DialogTitle>
          </DialogHeader>
          <p>¿Enviar un cobro de <strong>$ {montoTerminal.toFixed(2)}</strong> a la terminal Mercado Pago?</p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setConfirmandoTerminal(false)}>Cancelar</Button>
            <Button variant="success" onClick={() => { setConfirmandoTerminal(false); void cobrarConTerminal(); }}>Sí, cobrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={exitoTerminal} onOpenChange={(o) => !o && setExitoTerminal(false)}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center gap-2 text-center">
            <CheckCircle2 className="size-14 text-success" />
            <h2 className="text-xl font-bold text-success">¡Pago aprobado en la terminal!</h2>
            <p>El cobro se realizó correctamente. Finaliza la venta:</p>
          </div>
          <DialogFooter>
            <Button onClick={() => { setExitoTerminal(false); confirmar('directo'); }}>
              <Printer /> Imprimir y finalizar
            </Button>
            <Button variant="secondary" onClick={() => { setExitoTerminal(false); confirmar('pantalla'); }}>
              Ver en pantalla
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
