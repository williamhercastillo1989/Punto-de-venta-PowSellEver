import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { ClienteDTO } from '@pos/types';
import { crearCliente, eliminarCliente, obtenerClientes } from '../api';
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

export function ClientesView(): JSX.Element {
  const [items, setItems] = useState<ClienteDTO[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [nombre, setNombre] = useState('');
  const [celular, setCelular] = useState('');

  function cargar(): void {
    obtenerClientes().then(setItems).catch((e: Error) => setError(e.message));
  }
  useEffect(cargar, []);

  async function crear(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setError(null);
    try {
      await crearCliente({ nombre, celular });
      setNombre('');
      setCelular('');
      cargar();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function baja(id: number): Promise<void> {
    try {
      await eliminarCliente(id);
      cargar();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <main className="p-4">
      <h2 className="mb-3 text-xl font-bold">Clientes</h2>
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
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((c) => (
            <TableRow key={c.idCliente}>
              <TableCell>{c.idCliente}</TableCell>
              <TableCell>{c.nombre}</TableCell>
              <TableCell>{c.celular}</TableCell>
              <TableCell className="text-right">{c.saldo}</TableCell>
              <TableCell className="text-right">
                <Button variant="destructive" size="sm" onClick={() => baja(c.idCliente)}>
                  <Trash2 /> Baja
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {items.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-muted-foreground">Sin clientes.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </main>
  );
}
