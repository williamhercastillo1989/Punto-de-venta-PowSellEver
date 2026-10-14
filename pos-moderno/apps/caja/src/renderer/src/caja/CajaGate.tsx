import { useCallback, useEffect, useState } from 'react';
import { Home } from 'lucide-react';
import type { TurnoAbiertoDTO, UsuarioAutenticadoDTO } from '@pos/types';
import { aperturaCaja, arqueoCaja, cierreCaja, turnoAbierto } from '../api';
import { VentasPage } from '../ventas/VentasPage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';

interface Props {
  idCaja: number;
  usuario: UsuarioAutenticadoDTO;
  onIr?: (modulo: string) => void;
  onInicio?: () => void;
}

/**
 * Exige un turno de caja ABIERTO antes de permitir vender.
 * - Sin turno → formulario de apertura (saldo inicial).
 * - Con turno → pantalla POS (VentasPage). Lo administrativo vive en Configurar.
 */
export function CajaGate({ idCaja, usuario, onIr, onInicio }: Props): JSX.Element {
  const [turno, setTurno] = useState<TurnoAbiertoDTO | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saldoInicial, setSaldoInicial] = useState('0');
  const [cierreInfo, setCierreInfo] = useState<string | null>(null);

  const refrescar = useCallback(() => {
    setCargando(true);
    turnoAbierto(idCaja)
      .then(setTurno)
      .catch((e: Error) => setError(e.message))
      .finally(() => setCargando(false));
  }, [idCaja]);

  useEffect(refrescar, [refrescar]);

  async function abrir(): Promise<void> {
    setError(null);
    try {
      await aperturaCaja({
        idCaja,
        idUsuario: usuario.idUsuario,
        saldoInicial: Number(saldoInicial) || 0,
      });
      refrescar();
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function cerrar(): Promise<void> {
    setError(null);
    try {
      const arqueo = await arqueoCaja(idCaja);
      const esperado = arqueo?.saldoEsperado ?? turno?.saldoInicial ?? 0;
      await cierreCaja({
        idCaja,
        idUsuario: usuario.idUsuario,
        ingresos: arqueo?.ingresos ?? 0,
        egresos: arqueo?.gastos ?? 0,
        saldoQuedaEnCaja: esperado,
        totalCalculado: esperado,
        totalReal: esperado,
        diferencia: 0,
      });
      setCierreInfo(
        arqueo
          ? `Caja cerrada. Esperado en efectivo: ${esperado.toFixed(2)} ` +
              `(inicial ${arqueo.saldoInicial.toFixed(2)} + ventas ${arqueo.ventasEfectivo.toFixed(2)} ` +
              `+ ingresos ${arqueo.ingresos.toFixed(2)} − gastos ${arqueo.gastos.toFixed(2)})`
          : 'Caja cerrada.',
      );
      refrescar();
    } catch (e) {
      setError((e as Error).message);
    }
  }

  if (cargando) return <p className="p-4 text-muted-foreground">Cargando estado de la caja…</p>;

  if (!turno) {
    return (
      <div className="flex min-h-full items-center justify-center bg-background p-6">
        <Card className="flex w-full max-w-sm flex-col gap-4 p-6">
          {onInicio && (
            <Button variant="ghost" size="sm" className="self-start" onClick={onInicio}>
              <Home /> Volver al Dashboard
            </Button>
          )}
          <h2 className="text-xl font-bold">Abrir caja {idCaja}</h2>
          {cierreInfo && <Alert variant="success">{cierreInfo}</Alert>}
          {error && <Alert variant="error">{error}</Alert>}
          <div className="grid gap-1.5">
            <Label htmlFor="saldo-inicial">Saldo inicial</Label>
            <Input
              id="saldo-inicial"
              type="number"
              value={saldoInicial}
              onChange={(e) => setSaldoInicial(e.target.value)}
            />
          </div>
          <Button onClick={abrir}>Abrir turno</Button>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-card px-4 py-2">
        <span className="flex items-center gap-3">
          {usuario.foto ? (
            <img className="size-10 rounded-full object-cover" src={usuario.foto} alt="" />
          ) : (
            <span className="flex size-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
              {(usuario.nombres ?? usuario.login ?? '?').trim().charAt(0).toUpperCase()}
            </span>
          )}
          <span className="text-sm">
            <strong>Atiende: {usuario.nombres ?? usuario.login}</strong>
            <br />
            <span className="text-muted-foreground">
              Turno abierto · Caja {turno.idCaja} · Saldo inicial{' '}
              {turno.saldoInicial.toFixed(2)}
            </span>
          </span>
        </span>
        <span className="flex gap-2">
          {onInicio && (
            <Button variant="outline" size="sm" onClick={onInicio}>
              <Home /> Dashboard
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={cerrar}>
            Cerrar caja
          </Button>
        </span>
      </div>
      {error && (
        <Alert variant="error" className="mx-4 mt-2">
          {error}
        </Alert>
      )}
      <VentasPage
        idCaja={idCaja}
        idUsuario={usuario.idUsuario}
        usuario={usuario}
        onIr={onIr}
        onCerrarTurno={cerrar}
      />
    </>
  );
}
