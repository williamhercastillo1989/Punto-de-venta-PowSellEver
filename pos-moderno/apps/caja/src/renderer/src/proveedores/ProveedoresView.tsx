import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import type { ProveedorDTO } from '@pos/types';
import { crearProveedor, obtenerProveedores } from '../api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export function ProveedoresView(): JSX.Element {
  const [items, setItems] = useState<ProveedorDTO[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [nombre, setNombre] = useState('');
  const [celular, setCelular] = useState('');

  function cargar(): void {
    obtenerProveedores().then(setItems).catch((e: Error) => setError(e.message));
  }
  useEffect(cargar, []);

  async function crear(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setError(null);
    try {
      await crearProveedor({ nombre, celular, estado: 'ACTIVO' });
      setNombre('');
      setCelular('');
      cargar();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <main className="p-4">
      <h2 className="mb-3 text-xl font-bold">Proveedores</h2>
      {error && <Alert variant="error" className="mb-3">{error}</Alert>}
      <Card className="mb-4">
        <CardContent className="p-4">
          <form className="flex flex-wrap items-center gap-3" onSubmit={crear}>
            <Input
              className="max-w-xs"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
            <Input
              className="max-w-xs"
              placeholder="Celular"
              value={celular}
              onChange={(e) => setCelular(e.target.value)}
            />
            <Button type="submit">
              <Plus /> Agregar
            </Button>
          </form>
        </CardContent>
      </Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Celular</TableHead>
            <TableHead className="text-right">Saldo</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((p) => (
            <TableRow key={p.idProveedor}>
              <TableCell>{p.idProveedor}</TableCell>
              <TableCell>{p.nombre}</TableCell>
              <TableCell>{p.celular}</TableCell>
              <TableCell className="text-right">{p.saldo}</TableCell>
            </TableRow>
          ))}
          {items.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-muted-foreground">Sin proveedores.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </main>
  );
}
