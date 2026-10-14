import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  Download,
  FileSpreadsheet,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
} from 'lucide-react';
import type { ProductoDTO } from '@pos/types';
import {
  actualizarProducto,
  crearGrupo,
  crearProducto,
  descargarPlantillaProductos,
  eliminarProducto,
  importarProductosExcel,
  obtenerGrupos,
  obtenerProductos,
} from '../api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const SIN_GRUPO = '__none__';

const VACIO = {
  id: null as number | null,
  descripcion: '',
  seVendeA: 'UNIDAD',
  costo: '0',
  ganancia: '0',
  precioVenta: '0',
  precioMayoreo: '0',
  aPartirDe: '0',
  idGrupo: '' as number | '',
  codigo: '',
  controlar: true,
  stock: '0',
  stockMinimo: '0',
  fechaVencimiento: '',
  noAplicaVenc: false,
};

export function ProductosView(): JSX.Element {
  const [productos, setProductos] = useState<ProductoDTO[]>([]);
  const [grupos, setGrupos] = useState<Array<{ idLine: number; linea: string }>>([]);
  const [vista, setVista] = useState<'lista' | 'form'>('lista');
  const [f, setF] = useState({ ...VACIO });
  const [busqueda, setBusqueda] = useState('');
  const [nuevoGrupo, setNuevoGrupo] = useState('');
  const [mostrarNuevoGrupo, setMostrarNuevoGrupo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function importar(e: React.ChangeEvent<HTMLInputElement>): Promise<void> {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setError(null);
    try {
      const r = await importarProductosExcel(file);
      setMsg(
        `Importación: ${r.creados} creados, ${r.omitidos} omitidos` +
          (r.errores.length ? `, ${r.errores.length} con error` : ''),
      );
      cargar();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  function cargar(): void {
    obtenerProductos().then(setProductos).catch((e: Error) => setError(e.message));
    obtenerGrupos().then(setGrupos).catch(() => undefined);
  }
  useEffect(cargar, []);

  const grupoNombre = (id: number | null): string =>
    grupos.find((g) => g.idLine === id)?.linea ?? '';

  // costo / % ganancia / precio de venta vinculados
  function setCosto(v: string): void {
    const costo = Number(v) || 0;
    const gan = Number(f.ganancia) || 0;
    setF((p) => ({ ...p, costo: v, precioVenta: (costo * (1 + gan / 100)).toFixed(2) }));
  }
  function setGanancia(v: string): void {
    const costo = Number(f.costo) || 0;
    const gan = Number(v) || 0;
    setF((p) => ({ ...p, ganancia: v, precioVenta: (costo * (1 + gan / 100)).toFixed(2) }));
  }
  function setPrecioVenta(v: string): void {
    const costo = Number(f.costo) || 0;
    const pv = Number(v) || 0;
    setF((p) => ({ ...p, precioVenta: v, ganancia: costo > 0 ? ((pv / costo - 1) * 100).toFixed(2) : '0' }));
  }
  function generarCodigo(): void {
    setF((p) => ({ ...p, codigo: String(Math.floor(10000000 + Math.random() * 89999999)) }));
  }

  function abrirNuevo(): void {
    setF({ ...VACIO });
    setMsg(null);
    setError(null);
    setVista('form');
  }

  function abrirEditar(p: ProductoDTO): void {
    const costo = p.precioCompra ?? 0;
    const pv = p.precioVenta ?? 0;
    setF({
      id: p.id,
      descripcion: p.descripcion ?? '',
      seVendeA: (p as { seVendeA?: string }).seVendeA ?? 'UNIDAD',
      costo: String(costo),
      ganancia: costo > 0 ? ((pv / costo - 1) * 100).toFixed(2) : '0',
      precioVenta: String(pv),
      precioMayoreo: String(p.precioMayoreo ?? 0),
      aPartirDe: '0',
      idGrupo: p.idGrupo ?? '',
      codigo: p.codigo ?? '',
      controlar: (p.usaInventarios ?? 'NO') === 'SI',
      stock: p.stock ?? '0',
      stockMinimo: String(p.stockMinimo ?? 0),
      fechaVencimiento: p.fechaVencimiento ?? '',
      noAplicaVenc: false,
    });
    setMsg(null);
    setError(null);
    setVista('form');
  }

  async function agregarGrupo(): Promise<void> {
    if (!nuevoGrupo.trim()) return;
    try {
      await crearGrupo(nuevoGrupo.trim());
      setNuevoGrupo('');
      setMostrarNuevoGrupo(false);
      obtenerGrupos().then(setGrupos);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function guardar(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setError(null);
    const dto: Record<string, unknown> = {
      descripcion: f.descripcion,
      codigo: f.codigo || undefined,
      idGrupo: f.idGrupo || undefined,
      seVendeA: f.seVendeA,
      precioCompra: Number(f.costo) || 0,
      precioVenta: Number(f.precioVenta) || 0,
      precioMayoreo: Number(f.precioMayoreo) || 0,
      aPartirDe: Number(f.aPartirDe) || 0,
      usaInventarios: f.controlar ? 'SI' : 'NO',
      stock: f.controlar ? f.stock : '0',
      stockMinimo: f.controlar ? Number(f.stockMinimo) || 0 : 0,
      impuesto: '0',
      fechaVencimiento: f.controlar && !f.noAplicaVenc ? f.fechaVencimiento : undefined,
    };
    try {
      if (f.id) await actualizarProducto(f.id, dto);
      else await crearProducto(dto);
      setMsg(`Producto "${f.descripcion}" guardado.`);
      cargar();
      setVista('lista');
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function borrar(id: number): Promise<void> {
    try {
      await eliminarProducto(id);
      cargar();
    } catch (e) {
      setError((e as Error).message);
    }
  }

  const lista = useMemo(() => {
    const q = busqueda.toLowerCase();
    return productos.filter(
      (p) =>
        !q ||
        (p.descripcion ?? '').toLowerCase().includes(q) ||
        (p.codigo ?? '').toLowerCase().includes(q),
    );
  }, [productos, busqueda]);

  const costoInventario = productos.reduce(
    (a, p) => a + (p.precioCompra ?? 0) * (Number(p.stock) || 0),
    0,
  );

  // ---------- Vista LISTA ----------
  if (vista === 'lista') {
    return (
      <main className="min-h-full bg-background p-5">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <Input
            className="max-w-xs"
            placeholder="Buscar…"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <input
            ref={fileRef}
            type="file"
            accept=".xlsx"
            className="hidden"
            onChange={importar}
          />
          <Button variant="outline" type="button" onClick={() => fileRef.current?.click()}>
            <FileSpreadsheet /> Importar desde EXCEL
          </Button>
          <Button
            variant="outline"
            type="button"
            className="text-muted-foreground"
            onClick={() => void descargarPlantillaProductos()}
          >
            <Download /> Plantilla
          </Button>
          <Button type="button" onClick={abrirNuevo} title="Agregar producto" className="ml-auto">
            <Plus /> Agregar
          </Button>
        </div>

        {error && <Alert variant="error" className="mb-3">{error}</Alert>}
        {msg && <Alert variant="success" className="mb-3">{msg}</Alert>}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Codigo</TableHead>
              <TableHead>Grupo</TableHead>
              <TableHead>Descripcion</TableHead>
              <TableHead className="text-right">Impuesto</TableHead>
              <TableHead className="text-right">P_Compra</TableHead>
              <TableHead className="text-right">P_mayoreo</TableHead>
              <TableHead className="text-right">Stock_minimo</TableHead>
              <TableHead>F_vencimiento</TableHead>
              <TableHead className="text-right">Stock</TableHead>
              <TableHead className="text-right">P_venta</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lista.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-destructive"
                      title="Eliminar"
                      onClick={() => borrar(p.id)}
                    >
                      <Trash2 />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      title="Editar"
                      onClick={() => abrirEditar(p)}
                    >
                      <Pencil />
                    </Button>
                  </div>
                </TableCell>
                <TableCell>{p.codigo}</TableCell>
                <TableCell>{grupoNombre(p.idGrupo)}</TableCell>
                <TableCell>{p.descripcion}</TableCell>
                <TableCell className="text-right">{p.impuesto ?? '0'}</TableCell>
                <TableCell className="text-right">{(p.precioCompra ?? 0).toFixed(2)}</TableCell>
                <TableCell className="text-right">{(p.precioMayoreo ?? 0).toFixed(2)}</TableCell>
                <TableCell className="text-right">{(p.stockMinimo ?? 0).toFixed(2)}</TableCell>
                <TableCell>{p.fechaVencimiento ?? ''}</TableCell>
                <TableCell className="text-right">{p.usaInventarios === 'SI' ? p.stock : '—'}</TableCell>
                <TableCell className="text-right">{(p.precioVenta ?? 0).toFixed(2)}</TableCell>
              </TableRow>
            ))}
            {lista.length === 0 && (
              <TableRow>
                <TableCell colSpan={11} className="text-muted-foreground">
                  Sin productos.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="mt-4 flex flex-wrap gap-6 rounded-lg bg-muted px-5 py-3">
          <span>Cant. de Productos: <strong>{productos.length}</strong></span>
          <span>Costo de Inventario: <strong>{costoInventario.toFixed(2)}</strong></span>
        </div>
      </main>
    );
  }

  // ---------- Vista FORMULARIO ----------
  return (
    <main className="min-h-full bg-background p-5">
      <div className="mb-4">
        <Button variant="outline" type="button" onClick={() => setVista('lista')}>
          <ArrowLeft /> Volver al listado
        </Button>
      </div>
      {error && <Alert variant="error" className="mb-3">{error}</Alert>}

      <Card className="max-w-3xl p-6">
        <form className="flex flex-col gap-4" onSubmit={guardar}>
          <div className="grid gap-1.5">
            <Label>Descripción:</Label>
            <Input value={f.descripcion} onChange={(e) => setF((p) => ({ ...p, descripcion: e.target.value }))} required />
          </div>

          <RadioGroup
            value={f.seVendeA}
            onValueChange={(v) => setF((p) => ({ ...p, seVendeA: v }))}
            className="grid-flow-col justify-start gap-6"
          >
            <label className="flex items-center gap-2 text-sm">
              <RadioGroupItem value="UNIDAD" /> Por Unidad/Pieza
            </label>
            <label className="flex items-center gap-2 text-sm">
              <RadioGroupItem value="GRANEL" /> A granel (usa decimales)
            </label>
          </RadioGroup>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="grid gap-1.5">
              <Label>Precio Costo:</Label>
              <Input type="number" step="0.01" value={f.costo} onChange={(e) => setCosto(e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label>% Ganancia:</Label>
              <Input type="number" step="0.01" value={f.ganancia} onChange={(e) => setGanancia(e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label>Precio venta:</Label>
              <Input type="number" step="0.01" value={f.precioVenta} onChange={(e) => setPrecioVenta(e.target.value)} />
            </div>
          </div>

          <div className="flex flex-wrap items-end gap-3">
            <div className="grid gap-1.5">
              <Label>Precio Mayoreo:</Label>
              <Input type="number" step="0.01" value={f.precioMayoreo} onChange={(e) => setF((p) => ({ ...p, precioMayoreo: e.target.value }))} />
            </div>
            <div className="grid gap-1.5">
              <Label>A partir de:</Label>
              <Input className="w-24" type="number" value={f.aPartirDe} onChange={(e) => setF((p) => ({ ...p, aPartirDe: e.target.value }))} />
            </div>
            <span className="pb-2 text-sm text-muted-foreground">Unidades</span>
          </div>

          <div className="flex flex-wrap items-end gap-3">
            <div className="grid gap-1.5">
              <Label>Grupo:</Label>
              <Select
                value={f.idGrupo ? String(f.idGrupo) : SIN_GRUPO}
                onValueChange={(v) => setF((p) => ({ ...p, idGrupo: v && v !== SIN_GRUPO ? Number(v) : '' }))}
              >
                <SelectTrigger className="min-w-[14rem]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={SIN_GRUPO}>— sin grupo —</SelectItem>
                  {grupos.map((g) => (
                    <SelectItem key={g.idLine} value={String(g.idLine)}>{g.linea}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" type="button" onClick={() => setMostrarNuevoGrupo((v) => !v)}>
              <Plus /> Agregar Grupo
            </Button>
          </div>
          {mostrarNuevoGrupo && (
            <div className="flex items-end gap-3">
              <Input className="max-w-xs" placeholder="Nombre del grupo" value={nuevoGrupo} onChange={(e) => setNuevoGrupo(e.target.value)} />
              <Button variant="outline" type="button" onClick={agregarGrupo}>Guardar grupo</Button>
            </div>
          )}

          <div className="flex flex-wrap items-end gap-3">
            <div className="grid gap-1.5">
              <Label>Código de barras:</Label>
              <Input value={f.codigo} onChange={(e) => setF((p) => ({ ...p, codigo: e.target.value }))} />
            </div>
            <Button variant="outline" type="button" onClick={generarCodigo}>
              <RefreshCw /> Generar código
            </Button>
          </div>

          <div className="rounded-lg border p-4">
            <label className="flex items-center gap-2 text-sm font-semibold">
              <Checkbox
                checked={f.controlar}
                onCheckedChange={(c) => setF((p) => ({ ...p, controlar: c === true }))}
              />
              Controlar inventarios
            </label>
            {f.controlar && (
              <div className="mt-4 flex flex-col gap-4">
                <div className="flex flex-wrap items-end gap-3">
                  <div className="grid gap-1.5">
                    <Label>Hay:</Label>
                    <Input type="number" step="0.01" value={f.stock} onChange={(e) => setF((p) => ({ ...p, stock: e.target.value }))} />
                  </div>
                  <span className="pb-2 text-sm text-muted-foreground">en este momento.</span>
                </div>
                <div className="grid max-w-xs gap-1.5">
                  <Label>Mínimo:</Label>
                  <Input type="number" step="0.01" value={f.stockMinimo} onChange={(e) => setF((p) => ({ ...p, stockMinimo: e.target.value }))} />
                </div>
                <div className="flex flex-wrap items-end gap-4">
                  <div className="grid gap-1.5">
                    <Label>Fecha de Venc:</Label>
                    <Input type="date" value={f.fechaVencimiento} disabled={f.noAplicaVenc} onChange={(e) => setF((p) => ({ ...p, fechaVencimiento: e.target.value }))} />
                  </div>
                  <label className="flex items-center gap-2 pb-2 text-sm">
                    <Checkbox
                      checked={f.noAplicaVenc}
                      onCheckedChange={(c) => setF((p) => ({ ...p, noAplicaVenc: c === true }))}
                    />
                    No aplica
                  </label>
                </div>
              </div>
            )}
          </div>

          <Button type="submit" className="self-start">
            {f.id ? 'Actualizar' : 'Guardar'}
          </Button>
        </form>
      </Card>
    </main>
  );
}
