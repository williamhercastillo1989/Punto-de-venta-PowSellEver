import { useCallback, useEffect, useState } from 'react';
import type { TurnoAbiertoDTO, UsuarioAutenticadoDTO } from '@pos/types';
import { aperturaCaja, arqueoCaja, cierreCaja, turnoAbierto } from '../api';
import { VentasPage } from '../ventas/VentasPage';
import { InventarioView } from '../inventario/InventarioView';
import { ComprasView } from '../compras/ComprasView';

type Tab = 'ventas' | 'inventario' | 'compras';

interface Props {
  idCaja: number;
  usuario: UsuarioAutenticadoDTO;
}

/**
 * Exige un turno de caja ABIERTO antes de permitir vender.
 * - Sin turno → formulario de apertura (saldo inicial).
 * - Con turno → ventas + botón de cierre.
 */
export function CajaGate({ idCaja, usuario }: Props): JSX.Element {
  const [turno, setTurno] = useState<TurnoAbiertoDTO | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saldoInicial, setSaldoInicial] = useState('0');
  const [cierreInfo, setCierreInfo] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>('ventas');

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
      // Arqueo del turno: calcula el efectivo esperado antes de cerrar.
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

  if (cargando) return <p style={{ padding: 16 }}>Cargando estado de la caja…</p>;

  if (!turno) {
    return (
      <div className="apertura">
        <div className="apertura__card">
          <h2>Abrir caja {idCaja}</h2>
          {cierreInfo && <p className="alert alert--ok">{cierreInfo}</p>}
          {error && <p className="alert alert--error">{error}</p>}
          <label>
            Saldo inicial
            <input
              type="number"
              value={saldoInicial}
              onChange={(e) => setSaldoInicial(e.target.value)}
            />
          </label>
          <button className="btn btn--primary" onClick={abrir}>
            Abrir turno
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="turno-bar">
        <span>
          Turno abierto · Caja {turno.idCaja} · Saldo inicial{' '}
          {turno.saldoInicial.toFixed(2)}
        </span>
        <button onClick={cerrar}>Cerrar caja</button>
      </div>

      <nav className="tabs">
        <button
          className={tab === 'ventas' ? 'tabs__btn tabs__btn--on' : 'tabs__btn'}
          onClick={() => setTab('ventas')}
        >
          Ventas
        </button>
        <button
          className={
            tab === 'inventario' ? 'tabs__btn tabs__btn--on' : 'tabs__btn'
          }
          onClick={() => setTab('inventario')}
        >
          Inventario
        </button>
        <button
          className={tab === 'compras' ? 'tabs__btn tabs__btn--on' : 'tabs__btn'}
          onClick={() => setTab('compras')}
        >
          Compras
        </button>
      </nav>

      {error && <p className="alert alert--error">{error}</p>}

      {tab === 'ventas' && (
        <VentasPage idCaja={idCaja} idUsuario={usuario.idUsuario} />
      )}
      {tab === 'inventario' && (
        <InventarioView idCaja={idCaja} idUsuario={usuario.idUsuario} />
      )}
      {tab === 'compras' && (
        <ComprasView idCaja={idCaja} idUsuario={usuario.idUsuario} />
      )}
    </>
  );
}
