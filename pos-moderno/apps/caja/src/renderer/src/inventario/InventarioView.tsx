import { useEffect, useMemo, useState } from 'react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  BarChart3,
  CalendarClock,
  FileText,
  Printer,
  RefreshCw,
  Search,
  TrendingDown,
} from 'lucide-react';
import type {
  InventarioItemDTO,
  MovimientoKardexDTO,
  ProductoDTO,
  VencimientoItemDTO,
} from '@pos/types';
import { TipoMovimientoKardex } from '@pos/types';
import {
  ajusteInventario,
  inventarioBajoMinimo,
  movimientosKardex,
  obtenerInventario,
  obtenerProductos,
  vencimientosInventario,
} from '../api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface Props {
  idCaja: number;
  idUsuario: number;
}

const TABS = [
  { k: 'kardex', label: 'Kardex', Icon: BarChart3 },
  { k: 'movimientos', label: 'Movimientos', Icon: RefreshCw },
  { k: 'bajos', label: 'Inventarios Bajos', Icon: TrendingDown },
  { k: 'reporte', label: 'Reporte Inventarios', Icon: FileText },
  { k: 'vencimientos', label: 'Vencimientos de Productos', Icon: CalendarClock },
] as const;

const n = (v: number | string | null | undefined): string =>
  v == null || v === '' ? '0.00' : Number(v).toFixed(2);

function PrintBtn(): JSX.Element {
  return (
    <Button variant="outline" size="sm" onClick={() => window.print()}>
      <Printer /> Imprimir
    </Button>
  );
}

export function InventarioView({ idCaja, idUsuario }: Props): JSX.Element {
  const [tab, setTab] = useState<string>('kardex');
  const [productos, setProductos] = useState<ProductoDTO[]>([]);
  const [ajuste, setAjuste] = useState<null | 'Entrada' | 'Salida'>(null);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    obtenerProductos().then(setProductos).catch(() => setProductos([]));
  }, [refresh]);

  return (
    <Tabs value={tab} onValueChange={setTab} className="min-h-full bg-background">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b px-5 pt-4">
        <div>
          <h2 className="mb-1 text-xl font-bold">Inventarios</h2>
          <TabsList>
            {TABS.map(({ k, label, Icon }) => (
              <TabsTrigger key={k} value={k}>
                <Icon /> {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <div className="flex gap-3 pb-2">
          <Button variant="outline" className="rounded-full text-success" onClick={() => setAjuste('Entrada')}>
            <ArrowDownLeft /> Entrada
          </Button>
          <Button variant="outline" className="rounded-full text-destructive" onClick={() => setAjuste('Salida')}>
            <ArrowUpRight /> Salida
          </Button>
        </div>
      </header>

      <div className="p-5" key={refresh}>
        <TabsContent value="kardex"><KardexTab productos={productos} /></TabsContent>
        <TabsContent value="movimientos"><MovimientosTab productos={productos} /></TabsContent>
        <TabsContent value="bajos"><BajosTab /></TabsContent>
        <TabsContent value="reporte"><ReporteTab /></TabsContent>
        <TabsContent value="vencimientos"><VencimientosTab /></TabsContent>
      </div>

      {ajuste && (
        <AjusteModal
          tipo={ajuste}
          productos={productos}
          idCaja={idCaja}
          idUsuario={idUsuario}
          onClose={() => setAjuste(null)}
          onDone={() => {
            setAjuste(null);
            setRefresh((r) => r + 1);
          }}
        />
      )}
    </Tabs>
  );
}

/* ---------- Buscador de producto ---------- */
function ProductoBuscador({
  productos,
  onSelect,
  placeholder,
}: {
  productos: ProductoDTO[];
  onSelect: (p: ProductoDTO | null) => void;
  placeholder: string;
}): JSX.Element {
  const [q, setQ] = useState('');
  const [abierto, setAbierto] = useState(false);

  const matches = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return [];
    return productos
      .filter((p) => `${p.descripcion ?? ''} ${p.codigo ?? ''}`.toLowerCase().includes(t))
      .slice(0, 8);
  }, [q, productos]);

  return (
    <div className="relative mb-4 max-w-xl">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        className="bg-primary/10 pl-9"
        value={q}
        placeholder={placeholder}
        onChange={(e) => {
          setQ(e.target.value);
          setAbierto(true);
          if (!e.target.value) onSelect(null);
        }}
        onFocus={() => setAbierto(true)}
      />
      {abierto && matches.length > 0 && (
        <ul className="absolute z-20 mt-1 max-h-72 w-full overflow-auto rounded-md border bg-popover p-1 shadow-md">
          {matches.map((p) => (
            <li
              key={p.id}
              className="cursor-pointer rounded-sm px-3 py-2 text-sm hover:bg-accent"
              onClick={() => {
                onSelect(p);
                setQ(`${p.descripcion} /Precio: ${n(p.precioVenta)} /Codigo: ${p.codigo ?? ''}`);
                setAbierto(false);
              }}
            >
              <strong>{p.descripcion}</strong>
              <span className="text-muted-foreground"> · {p.codigo} · S/ {n(p.precioVenta)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ---------- Kardex ---------- */
function KardexTab({ productos }: { productos: ProductoDTO[] }): JSX.Element {
  const [prod, setProd] = useState<ProductoDTO | null>(null);
  const [movs, setMovs] = useState<MovimientoKardexDTO[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!prod) return setMovs([]);
    movimientosKardex(prod.id).then(setMovs).catch((e: Error) => setError(e.message));
  }, [prod]);

  const existencia = movs.length ? movs[0].hay ?? 0 : 0;

  return (
    <>
      <ProductoBuscador productos={productos} onSelect={setProd} placeholder="Buscar producto para ver su Kardex…" />
      {error && <Alert variant="error" className="mb-3">{error}</Alert>}
      {!prod ? (
        <p className="py-10 text-center text-muted-foreground">Busca un producto para ver su Kardex.</p>
      ) : (
        <div>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-center text-lg font-semibold">Kardex de Inventario</h3>
              <div className="flex flex-wrap gap-4 text-sm">
                <span><b>Producto:</b> {prod.descripcion}</span>
                <span><b>Existencia Actual:</b> {n(existencia)}</span>
                <span className="text-muted-foreground">{new Date().toLocaleString()}</span>
              </div>
            </div>
            <PrintBtn />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead rowSpan={2}>Fecha</TableHead>
                <TableHead rowSpan={2}>Detalle</TableHead>
                <TableHead colSpan={3} className="bg-success/10 text-center">ENTRADA</TableHead>
                <TableHead colSpan={3} className="bg-destructive/10 text-center">SALIDA</TableHead>
                <TableHead colSpan={3} className="bg-primary/10 text-center">Existencias</TableHead>
              </TableRow>
              <TableRow>
                <TableHead className="text-right">Cant</TableHead><TableHead className="text-right">C.Unit</TableHead><TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Cant</TableHead><TableHead className="text-right">C.Unit</TableHead><TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Cant</TableHead><TableHead className="text-right">C.Unit</TableHead><TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {movs.map((m) => {
                const esEntrada = (m.tipo ?? '').toUpperCase() === 'ENTRADA';
                const cu = m.costoUnt ?? 0;
                const cant = m.cantidad ?? 0;
                const hay = m.hay ?? 0;
                return (
                  <TableRow key={m.idKardex}>
                    <TableCell>{m.fecha ? new Date(m.fecha).toLocaleString() : ''}</TableCell>
                    <TableCell>{m.motivo}</TableCell>
                    <TableCell className="text-right">{esEntrada ? n(cant) : ''}</TableCell>
                    <TableCell className="text-right">{esEntrada ? n(cu) : ''}</TableCell>
                    <TableCell className="text-right">{esEntrada ? n(cant * cu) : ''}</TableCell>
                    <TableCell className="text-right">{!esEntrada ? n(cant) : ''}</TableCell>
                    <TableCell className="text-right">{!esEntrada ? n(cu) : ''}</TableCell>
                    <TableCell className="text-right">{!esEntrada ? n(cant * cu) : ''}</TableCell>
                    <TableCell className="text-right">{n(hay)}</TableCell>
                    <TableCell className="text-right">{n(cu)}</TableCell>
                    <TableCell className="text-right">{n(hay * cu)}</TableCell>
                  </TableRow>
                );
              })}
              {movs.length === 0 && (
                <TableRow><TableCell colSpan={11} className="text-muted-foreground">Sin movimientos.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
}

/* ---------- Movimientos ---------- */
function MovimientosTab({ productos }: { productos: ProductoDTO[] }): JSX.Element {
  const [prod, setProd] = useState<ProductoDTO | null>(null);
  const [movs, setMovs] = useState<MovimientoKardexDTO[]>([]);

  useEffect(() => {
    if (!prod) return setMovs([]);
    movimientosKardex(prod.id).then(setMovs).catch(() => setMovs([]));
  }, [prod]);

  return (
    <>
      <ProductoBuscador productos={productos} onSelect={setProd} placeholder="Buscar producto para ver sus movimientos…" />
      <div className="mb-3"><PrintBtn /></div>
      {!prod ? (
        <p className="py-10 text-center text-muted-foreground">Busca un producto para ver sus movimientos.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead><TableHead>Descripción</TableHead><TableHead>Movimiento</TableHead>
              <TableHead className="text-right">Había</TableHead><TableHead>Tipo</TableHead>
              <TableHead className="text-right">Cantidad</TableHead><TableHead className="text-right">Hay</TableHead>
              <TableHead>Cajero</TableHead><TableHead>Categoría</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {movs.map((m) => {
              const esEntrada = (m.tipo ?? '').toUpperCase() === 'ENTRADA';
              return (
                <TableRow key={m.idKardex}>
                  <TableCell>{m.fecha ? new Date(m.fecha).toLocaleString() : ''}</TableCell>
                  <TableCell>{m.descripcion}</TableCell>
                  <TableCell>{m.motivo}</TableCell>
                  <TableCell className="text-right">{n(m.habia)}</TableCell>
                  <TableCell><Badge variant={esEntrada ? 'success' : 'destructive'}>{m.tipo}</Badge></TableCell>
                  <TableCell className="text-right">{n(m.cantidad)}</TableCell>
                  <TableCell className="text-right">{n(m.hay)}</TableCell>
                  <TableCell>{m.cajero}</TableCell>
                  <TableCell>{m.categoria}</TableCell>
                </TableRow>
              );
            })}
            {movs.length === 0 && (
              <TableRow><TableCell colSpan={9} className="text-muted-foreground">Sin movimientos.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </>
  );
}

/* ---------- Inventarios bajos ---------- */
function BajosTab(): JSX.Element {
  const [items, setItems] = useState<InventarioItemDTO[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    inventarioBajoMinimo().then(setItems).catch((e: Error) => setError(e.message));
  }, []);

  return (
    <>
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <PrintBtn />
        <span className="text-sm text-muted-foreground">
          Estos productos están debajo del mínimo de STOCK, te recomendamos gestionar tus productos.
        </span>
      </div>
      {error && <Alert variant="error" className="mb-3">{error}</Alert>}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead><TableHead>Descripción</TableHead>
            <TableHead className="text-right">Precio de Compra</TableHead>
            <TableHead className="text-right">Stock</TableHead>
            <TableHead className="text-right">Stock Mínimo</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((it) => (
            <TableRow key={it.idProducto} className="bg-destructive/5">
              <TableCell>{it.codigo}</TableCell>
              <TableCell>{it.descripcion}</TableCell>
              <TableCell className="text-right">{n(it.costo)}</TableCell>
              <TableCell className="text-right">{n(it.stock)}</TableCell>
              <TableCell className="text-right">{n(it.stockMinimo)}</TableCell>
            </TableRow>
          ))}
          {items.length === 0 && (
            <TableRow><TableCell colSpan={5} className="text-muted-foreground">No hay productos bajo el mínimo. 🎉</TableCell></TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}

/* ---------- Reporte ---------- */
const POR_PAGINA = 15;
function ReporteTab(): JSX.Element {
  const [items, setItems] = useState<InventarioItemDTO[]>([]);
  const [q, setQ] = useState('');
  const [pagina, setPagina] = useState(1);
  const [error, setError] = useState<string | null>(null);

  function cargar(filtro: string): void {
    obtenerInventario(filtro)
      .then((d) => { setItems(d); setPagina(1); })
      .catch((e: Error) => setError(e.message));
  }
  useEffect(() => cargar(''), []);

  const totalImporte = items.reduce((s, it) => s + Number(it.importe ?? 0), 0);
  const paginas = Math.max(1, Math.ceil(items.length / POR_PAGINA));
  const visibles = items.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA);

  return (
    <>
      <div className="mb-4 flex flex-wrap gap-6 rounded-lg bg-muted px-5 py-3">
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground">Cantidad de Productos en Inventario</span>
          <strong className="text-2xl">{items.length}</strong>
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground">Costo del Inventario</span>
          <strong className="text-2xl text-success">{n(totalImporte)}</strong>
        </div>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-3">
        <Input
          className="max-w-xs"
          placeholder="Buscar producto…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') cargar(q); }}
        />
        <Button onClick={() => cargar(q)}>Buscar</Button>
        <Button variant="secondary" onClick={() => { setQ(''); cargar(''); }}>Mostrar TODO</Button>
        <PrintBtn />
      </div>
      {error && <Alert variant="error" className="mb-3">{error}</Alert>}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead><TableHead>Descripción</TableHead>
            <TableHead className="text-right">Costo</TableHead><TableHead className="text-right">Precio Venta</TableHead>
            <TableHead className="text-right">Stock</TableHead><TableHead className="text-right">Stock Mínimo</TableHead>
            <TableHead>Categoría</TableHead><TableHead className="text-right">Importe</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {visibles.map((it) => (
            <TableRow key={it.idProducto}>
              <TableCell>{it.codigo}</TableCell>
              <TableCell>{it.descripcion}</TableCell>
              <TableCell className="text-right">{n(it.costo)}</TableCell>
              <TableCell className="text-right">{n(it.precioVenta)}</TableCell>
              <TableCell className="text-right">{n(it.stock)}</TableCell>
              <TableCell className="text-right">{n(it.stockMinimo)}</TableCell>
              <TableCell>{it.categoria}</TableCell>
              <TableCell className="text-right">{n(it.importe)}</TableCell>
            </TableRow>
          ))}
          {items.length === 0 && (
            <TableRow><TableCell colSpan={8} className="text-muted-foreground">Sin productos.</TableCell></TableRow>
          )}
        </TableBody>
      </Table>

      {paginas > 1 && (
        <div className="mt-4 flex items-center justify-center gap-4">
          <Button variant="outline" size="sm" disabled={pagina <= 1} onClick={() => setPagina((p) => p - 1)}>← Anterior</Button>
          <span className="text-sm">Página {pagina} de {paginas}</span>
          <Button variant="outline" size="sm" disabled={pagina >= paginas} onClick={() => setPagina((p) => p + 1)}>Siguiente →</Button>
        </div>
      )}
    </>
  );
}

/* ---------- Vencimientos ---------- */
function VencimientosTab(): JSX.Element {
  const [modo, setModo] = useState<'por_vencer' | 'vencidos'>('por_vencer');
  const [q, setQ] = useState('');
  const [items, setItems] = useState<VencimientoItemDTO[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    vencimientosInventario(modo, 30, q).then(setItems).catch((e: Error) => setError(e.message));
  }, [modo, q]);

  return (
    <>
      <div className="mb-4 flex flex-wrap items-start gap-6">
        <Input className="max-w-xs" placeholder="Buscar producto / código…" value={q} onChange={(e) => setQ(e.target.value)} />
        <fieldset className="rounded-lg border px-4 py-2">
          <legend className="px-1 text-sm font-semibold">Filtros</legend>
          <RadioGroup value={modo} onValueChange={(v) => setModo(v as 'por_vencer' | 'vencidos')}>
            <label className="flex items-center gap-2 text-sm">
              <RadioGroupItem value="por_vencer" /> Por vencer en menos de 30 días
            </label>
            <label className="flex items-center gap-2 text-sm">
              <RadioGroupItem value="vencidos" /> Productos vencidos (todos)
            </label>
          </RadioGroup>
        </fieldset>
        <PrintBtn />
      </div>
      {error && <Alert variant="error" className="mb-3">{error}</Alert>}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead><TableHead>Descripción</TableHead><TableHead>F. Vencimiento</TableHead>
            <TableHead className="text-right">Stock</TableHead><TableHead className="text-right">Días a Vencer</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((it) => (
            <TableRow key={it.idProducto} className={(it.diasAVencer ?? 0) < 0 ? 'bg-destructive/5' : ''}>
              <TableCell>{it.codigo}</TableCell>
              <TableCell>{it.descripcion}</TableCell>
              <TableCell>{it.fechaVencimiento}</TableCell>
              <TableCell className="text-right">{n(it.stock)}</TableCell>
              <TableCell className="text-right">{it.diasAVencer}</TableCell>
            </TableRow>
          ))}
          {items.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-muted-foreground">
                {modo === 'vencidos' ? 'No hay productos vencidos.' : 'No hay productos por vencer en 30 días.'}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}

/* ---------- Modal Entrada / Salida ---------- */
function AjusteModal({
  tipo,
  productos,
  idCaja,
  idUsuario,
  onClose,
  onDone,
}: {
  tipo: 'Entrada' | 'Salida';
  productos: ProductoDTO[];
  idCaja: number;
  idUsuario: number;
  onClose: () => void;
  onDone: () => void;
}): JSX.Element {
  const [prod, setProd] = useState<ProductoDTO | null>(null);
  const [cantidad, setCantidad] = useState('1');
  const [motivo, setMotivo] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);

  async function aplicar(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setError(null);
    if (!prod) return setError('Selecciona un producto.');
    if (!(Number(cantidad) > 0)) return setError('La cantidad debe ser mayor a 0.');
    if (!motivo.trim()) return setError('Indica un motivo.');
    setGuardando(true);
    try {
      await ajusteInventario({
        idProducto: prod.id,
        idCaja,
        idUsuario,
        tipo: tipo === 'Entrada' ? TipoMovimientoKardex.Entrada : TipoMovimientoKardex.Salida,
        cantidad: Number(cantidad),
        motivo,
      });
      onDone();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setGuardando(false);
    }
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {tipo === 'Entrada' ? 'Entrada de inventario' : 'Salida de inventario'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={aplicar} className="flex flex-col gap-3">
          {error && <Alert variant="error">{error}</Alert>}
          <ProductoBuscador productos={productos} onSelect={setProd} placeholder="Buscar producto…" />
          {prod && (
            <p className="text-sm text-muted-foreground">
              {prod.descripcion} · stock actual: {prod.stock ?? '0'}
            </p>
          )}
          <div className="grid gap-1.5">
            <Label>Cantidad</Label>
            <Input type="number" min="0.01" step="0.01" value={cantidad} onChange={(e) => setCantidad(e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label>Motivo</Label>
            <Input value={motivo} onChange={(e) => setMotivo(e.target.value)} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={guardando}>
              {guardando ? 'Aplicando…' : `Aplicar ${tipo}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
