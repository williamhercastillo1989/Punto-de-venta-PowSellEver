import { useEffect, useState } from 'react';
import { Plus, ShoppingCart } from 'lucide-react';
import type {
  CompraLineaDTO,
  ProductoDTO,
  ProveedorDTO,
} from '@pos/types';
import {
  crearProveedor,
  obtenerProductos,
  obtenerProveedores,
  registrarCompra,
} from '../api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';
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

interface Props {
  idCaja: number;
  idUsuario: number;
}

export function ComprasView({ idCaja, idUsuario }: Props): JSX.Element {
  const [proveedores, setProveedores] = useState<ProveedorDTO[]>([]);
  const [productos, setProductos] = useState<ProductoDTO[]>([]);
  const [idProveedor, setIdProveedor] = useState<number | ''>('');
  const [lineas, setLineas] = useState<CompraLineaDTO[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [nuevoProv, setNuevoProv] = useState('');

  function cargar(): void {
    obtenerProveedores().then(setProveedores).catch(() => undefined);
    obtenerProductos().then(setProductos).catch(() => undefined);
  }
  useEffect(cargar, []);

  const total = lineas.reduce((a, l) => a + l.cantidad * l.costo, 0);

  function agregarLinea(p: ProductoDTO): void {
    if (lineas.some((l) => l.idProducto === p.id)) return;
    setLineas((prev) => [
      ...prev,
      {
        idProducto: p.id,
        descripcion: p.descripcion ?? '',
        cantidad: 1,
        costo: p.precioCompra ?? 0,
        usaInventarios: p.usaInventarios ?? 'NO',
      },
    ]);
  }

  function actualizar(idx: number, campo: 'cantidad' | 'costo', val: string): void {
    setLineas((prev) =>
      prev.map((l, i) => (i === idx ? { ...l, [campo]: Number(val) } : l)),
    );
  }

  async function guardarProveedor(): Promise<void> {
    if (!nuevoProv.trim()) return;
    try {
      await crearProveedor({ nombre: nuevoProv.trim(), estado: 'ACTIVO' });
      setNuevoProv('');
      cargar();
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function guardarCompra(): Promise<void> {
    setError(null);
    if (!idProveedor || lineas.length === 0) {
      setError('Selecciona un proveedor y al menos un producto.');
      return;
    }
    try {
      const r = await registrarCompra({
        idCaja,
        idUsuario,
        idProveedor: Number(idProveedor),
        lineas,
      });
      setMensaje(`Compra #${r.idCompra} registrada por ${r.total.toFixed(2)}.`);
      setLineas([]);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <main className="min-h-full bg-background p-5">
      <div className="mb-4">
        <h2 className="text-xl font-bold">Nueva compra</h2>
      </div>
      {error && <Alert variant="error" className="mb-3">{error}</Alert>}
      {mensaje && <Alert variant="success" className="mb-3">{mensaje}</Alert>}

      <Card className="mb-4 flex flex-wrap items-end gap-6 p-4">
        <div className="grid gap-1.5">
          <Label>Proveedor:</Label>
          <Select
            value={idProveedor ? String(idProveedor) : undefined}
            onValueChange={(v) => setIdProveedor(v ? Number(v) : '')}
          >
            <SelectTrigger className="min-w-[14rem]">
              <SelectValue placeholder="— selecciona —" />
            </SelectTrigger>
            <SelectContent>
              {proveedores.map((p) => (
                <SelectItem key={p.idProveedor} value={String(p.idProveedor)}>
                  {p.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end gap-2">
          <Input
            className="max-w-xs"
            placeholder="Nuevo proveedor…"
            value={nuevoProv}
            onChange={(e) => setNuevoProv(e.target.value)}
          />
          <Button variant="outline" onClick={guardarProveedor}>
            <Plus /> Agregar
          </Button>
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <section>
          <h3 className="mb-3 text-lg font-semibold">Productos</h3>
          <ul className="flex flex-col gap-2">
            {productos.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between rounded-md border bg-card px-3 py-2"
              >
                <span>{p.descripcion}</span>
                <Button variant="outline" size="sm" onClick={() => agregarLinea(p)}>
                  Añadir
                </Button>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="mb-3 text-lg font-semibold">Líneas de compra</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead className="text-right">Cantidad</TableHead>
                <TableHead className="text-right">Costo</TableHead>
                <TableHead className="text-right">Subtotal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lineas.map((l, i) => (
                <TableRow key={l.idProducto}>
                  <TableCell>{l.descripcion}</TableCell>
                  <TableCell className="text-right">
                    <Input
                      className="ml-auto max-w-[8rem] text-right"
                      type="number"
                      min="0"
                      step="0.01"
                      value={l.cantidad}
                      onChange={(e) => actualizar(i, 'cantidad', e.target.value)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Input
                      className="ml-auto max-w-[8rem] text-right"
                      type="number"
                      min="0"
                      step="0.01"
                      value={l.costo}
                      onChange={(e) => actualizar(i, 'costo', e.target.value)}
                    />
                  </TableCell>
                  <TableCell className="text-right">{(l.cantidad * l.costo).toFixed(2)}</TableCell>
                </TableRow>
              ))}
              {lineas.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-muted-foreground">
                    Sin líneas. Añade productos desde la izquierda.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div className="mt-3 flex items-center justify-between rounded-md bg-muted px-4 py-3">
            <strong>Total</strong>
            <strong className="text-lg">{total.toFixed(2)}</strong>
          </div>
          <Button
            className="mt-4"
            disabled={lineas.length === 0}
            onClick={guardarCompra}
          >
            <ShoppingCart /> Registrar compra (suma inventario)
          </Button>
        </section>
      </div>
    </main>
  );
}
