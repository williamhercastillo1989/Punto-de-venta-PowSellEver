import { useEffect, useState } from 'react';
import { HandCoins } from 'lucide-react';
import type { ClienteDTO } from '@pos/types';
import { crearCobro, obtenerClientes, obtenerCobros } from '../api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

export function CobrosView({ idCaja, idUsuario }: Props): JSX.Element {
  const [clientes, setClientes] = useState<ClienteDTO[]>([]);
  const [cobros, setCobros] = useState<Array<Record<string, unknown>>>([]);
  const [idCliente, setIdCliente] = useState<number | ''>('');
  const [monto, setMonto] = useState('0');
  const [detalle, setDetalle] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  function cargar(): void {
    obtenerClientes().then(setClientes).catch(() => undefined);
    obtenerCobros().then(setCobros).catch(() => undefined);
  }
  useEffect(cargar, []);

  async function registrar(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setError(null);
    if (!idCliente) {
      setError('Selecciona un cliente.');
      return;
    }
    try {
      await crearCobro({
        idCliente: Number(idCliente),
        idUsuario,
        idCaja,
        monto: Number(monto),
        detalle,
      });
      setMsg('Cobro registrado; saldo del cliente actualizado.');
      setMonto('0');
      setDetalle('');
      cargar();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <main className="min-h-full bg-background p-5">
      <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
        <HandCoins className="size-5" /> Cobros (abonos)
      </h2>
      {error && <Alert variant="error" className="mb-3">{error}</Alert>}
      {msg && <Alert variant="success" className="mb-3">{msg}</Alert>}
      <Card className="mb-5 p-4">
        <form className="flex flex-wrap items-center gap-3" onSubmit={registrar}>
          <Select
            value={idCliente === '' ? undefined : String(idCliente)}
            onValueChange={(v) => setIdCliente(v ? Number(v) : '')}
          >
            <SelectTrigger className="w-64">
              <SelectValue placeholder="— cliente —" />
            </SelectTrigger>
            <SelectContent>
              {clientes.map((c) => (
                <SelectItem key={c.idCliente} value={String(c.idCliente)}>
                  {c.nombre} (saldo {c.saldo})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            className="max-w-[10rem]"
            type="number"
            step="0.01"
            placeholder="Monto"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
          />
          <Input
            className="max-w-xs"
            placeholder="Detalle"
            value={detalle}
            onChange={(e) => setDetalle(e.target.value)}
          />
          <Button type="submit">Registrar</Button>
        </form>
      </Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Detalle</TableHead>
            <TableHead className="text-right">Monto</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cobros.map((c) => (
            <TableRow key={String(c.idControlCobro)}>
              <TableCell>{String(c.idControlCobro)}</TableCell>
              <TableCell>{c.fecha ? String(c.fecha).slice(0, 10) : ''}</TableCell>
              <TableCell>{String(c.detalle ?? '')}</TableCell>
              <TableCell className="text-right">{String(c.monto ?? '')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  );
}
