import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { UsuarioAutenticadoDTO } from '@pos/types';
import { obtenerDashboard, type DashboardData } from '../api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';

const DONUT = ['#a855f7', '#ec4899', '#6366f1', '#22d3ee', '#f59e0b'];

interface Props {
  usuario?: UsuarioAutenticadoDTO;
  onIr: (tab?: string) => void;
  onSalir?: () => void;
}

function Kpi({ label, value }: { label: string; value: string }): JSX.Element {
  return (
    <Card className="border-sidebar-border bg-sidebar-accent text-sidebar-accent-foreground">
      <CardContent className="p-4">
        <div className="text-xs text-sidebar-foreground/70">{label}</div>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

export function DashboardView({ usuario, onIr, onSalir }: Props): JSX.Element {
  const [d, setD] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    obtenerDashboard().then(setD).catch((e: Error) => setError(e.message));
  }, []);

  return (
    <div className="min-h-screen bg-sidebar text-sidebar-foreground">
      <div className="flex flex-wrap items-center gap-4 border-b border-sidebar-border px-5 py-3">
        <div className="text-xl font-bold">🖥️ PSE</div>
        <nav className="flex flex-wrap items-center gap-1">
          <Button
            variant="ghost"
            className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            onClick={() => onIr('reportes')}
          >
            Reportes
          </Button>
          <Button
            variant="ghost"
            className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            onClick={() => onIr('inventario')}
          >
            Inventarios
          </Button>
          <Button
            variant="ghost"
            className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            onClick={() => onIr('config')}
          >
            Configurar
          </Button>
          <Button
            className="bg-orange-500 text-white hover:bg-orange-600"
            onClick={() => onIr('compras')}
          >
            Comprar
          </Button>
        </nav>
        <span className="ml-auto flex items-center gap-2 text-sm">
          {usuario?.foto ? (
            <img className="size-8 rounded-full object-cover" src={usuario.foto} alt="" />
          ) : (
            <span className="flex size-8 items-center justify-center rounded-full bg-sidebar-primary text-sm font-semibold text-sidebar-primary-foreground">
              {(usuario?.nombres ?? usuario?.login ?? 'A').trim().charAt(0).toUpperCase()}
            </span>
          )}
          {usuario?.nombres ?? usuario?.login ?? 'Administrador'}
        </span>
        <Button onClick={() => onIr('ventas')}>Vender</Button>
        {onSalir && (
          <Button
            variant="outline"
            className="border-sidebar-border bg-transparent text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            onClick={onSalir}
          >
            Salir
          </Button>
        )}
      </div>

      <div className="p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="m-0 text-xl font-bold">Dashboard</h2>
            <span className="text-sm text-sidebar-foreground/70">Bienvenido al Panel de Control</span>
          </div>
          <div className="text-sm font-semibold text-sidebar-foreground/70">{d?.mes ?? ''}</div>
        </div>

        {error && <Alert variant="error" className="mb-3">{error}</Alert>}
        {!d && !error && <p>Cargando…</p>}

        {d && (
          <>
            <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              <Kpi label="CUENTAS POR COBRAR" value={`$ ${d.kpis.cuentasPorCobrar.toFixed(2)}`} />
              <Kpi label="CUENTAS POR PAGAR" value={`$ ${d.kpis.cuentasPorPagar.toFixed(2)}`} />
              <Kpi label="GANANCIA" value={`$ ${d.kpis.ganancia.toFixed(2)}`} />
              <Kpi label="STOCK BAJO" value={String(d.kpis.stockBajo)} />
              <Kpi label="N° CLIENTES" value={String(d.kpis.numClientes)} />
              <Kpi label="N° PRODUCTOS" value={String(d.kpis.numProductos)} />
            </div>

            <div className="mb-4 grid gap-4 lg:grid-cols-2">
              <Card className="border-sidebar-border bg-sidebar-accent text-sidebar-accent-foreground">
                <CardContent className="p-4">
                <div className="mb-3 flex flex-wrap gap-6">
                  <div className="flex flex-col"><span className="text-sm text-sidebar-foreground/70">Total VENTAS</span><strong className="text-xl">$ {d.totalVentas.toFixed(2)}</strong></div>
                  <div className="flex flex-col"><span className="text-sm text-sidebar-foreground/70">Total GANANCIA</span><strong className="text-xl">$ {d.totalGanancia.toFixed(2)}</strong></div>
                </div>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={d.ventasPorMes}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e3a8a" />
                    <XAxis dataKey="mes" stroke="#cbd5e1" fontSize={12} />
                    <YAxis stroke="#cbd5e1" fontSize={12} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="total" name="Monto Total" stroke="#c084fc" strokeWidth={3} dot />
                  </LineChart>
                </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card className="border-sidebar-border bg-sidebar-accent text-sidebar-accent-foreground">
                <CardContent className="p-4">
                <h3 className="mt-0 text-center font-semibold">5 Productos más vendidos</h3>
                <ResponsiveContainer width="100%" height={290}>
                  <PieChart>
                    <Pie data={d.topProductos} dataKey="cantidad" nameKey="producto" innerRadius={70} outerRadius={110} paddingAngle={2}>
                      {d.topProductos.map((_, i) => (<Cell key={i} fill={DONUT[i % DONUT.length]} />))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <Card className="border-sidebar-border bg-sidebar-accent text-sidebar-accent-foreground">
                <CardContent className="p-4">
                <h3 className="mt-0 font-semibold">En qué gastaste más</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={d.gastosPorConcepto}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e3a8a" />
                    <XAxis dataKey="concepto" stroke="#cbd5e1" fontSize={12} />
                    <YAxis stroke="#cbd5e1" fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="total" name="Monto Total" fill="#22c55e" />
                  </BarChart>
                </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card className="border-sidebar-border bg-sidebar-accent text-sidebar-accent-foreground">
                <CardContent className="p-4">
                <h3 className="mt-0 font-semibold">Gastos por mes</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={d.gastosPorMes}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e3a8a" />
                    <XAxis dataKey="mes" stroke="#cbd5e1" fontSize={12} />
                    <YAxis stroke="#cbd5e1" fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="total" name="Monto Total" fill="#16a34a" />
                  </BarChart>
                </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
