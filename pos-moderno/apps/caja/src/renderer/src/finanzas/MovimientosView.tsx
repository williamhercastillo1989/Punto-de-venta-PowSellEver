import { useEffect, useState } from 'react';
import { ArrowLeftRight, TrendingDown, TrendingUp } from 'lucide-react';
import type { ConceptoDTO } from '@pos/types';
import {
  crearGasto,
  crearIngreso,
  obtenerConceptos,
  obtenerGastos,
  obtenerIngresos,
} from '../api';
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
}

export function MovimientosView({ idCaja }: Props): JSX.Element {
  const [gastos, setGastos] = useState<Array<Record<string, unknown>>>([]);
  const [ingresos, setIngresos] = useState<Array<Record<string, unknown>>>([]);
  const [conceptos, setConceptos] = useState<ConceptoDTO[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [gImporte, setGImporte] = useState('0');
  const [gDesc, setGDesc] = useState('');
  const [gConcepto, setGConcepto] = useState<number | ''>('');
  const [iImporte, setIImporte] = useState('0');
  const [iDesc, setIDesc] = useState('');

  function cargar(): void {
    obtenerGastos().then(setGastos).catch(() => undefined);
    obtenerIngresos().then(setIngresos).catch(() => undefined);
    obtenerConceptos().then(setConceptos).catch(() => undefined);
  }
  useEffect(cargar, []);

  async function addGasto(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setError(null);
    try {
      await crearGasto({
        importe: Number(gImporte),
        descripcion: gDesc,
        idCaja,
        idConcepto: gConcepto ? Number(gConcepto) : undefined,
        tipoComprobante: 'TICKET',
      });
      setGImporte('0');
      setGDesc('');
      cargar();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function addIngreso(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setError(null);
    try {
      await crearIngreso({ importe: Number(iImporte), descripcion: iDesc, idCaja, tipoComprobante: 'RECIBO' });
      setIImporte('0');
      setIDesc('');
      cargar();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <main className="min-h-full bg-background p-5">
      <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
        <ArrowLeftRight className="size-5" /> Movimientos de caja
      </h2>
      {error && <Alert variant="error" className="mb-3">{error}</Alert>}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-4">
          <form onSubmit={addGasto}>
            <h3 className="mb-3 flex items-center gap-2 font-semibold text-destructive">
              <TrendingDown className="size-4" /> Gasto
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              <Input
                className="max-w-[9rem]"
                type="number"
                step="0.01"
                placeholder="Importe"
                value={gImporte}
                onChange={(e) => setGImporte(e.target.value)}
              />
              <Input
                className="max-w-xs"
                placeholder="Descripción"
                value={gDesc}
                onChange={(e) => setGDesc(e.target.value)}
                required
              />
              <Select
                value={gConcepto === '' ? undefined : String(gConcepto)}
                onValueChange={(v) => setGConcepto(v ? Number(v) : '')}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="— concepto —" />
                </SelectTrigger>
                <SelectContent>
                  {conceptos.map((c) => (
                    <SelectItem key={c.idConcepto} value={String(c.idConcepto)}>
                      {c.descripcion}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="submit">Agregar gasto</Button>
            </div>
          </form>
        </Card>
        <Card className="p-4">
          <form onSubmit={addIngreso}>
            <h3 className="mb-3 flex items-center gap-2 font-semibold text-success">
              <TrendingUp className="size-4" /> Ingreso
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              <Input
                className="max-w-[9rem]"
                type="number"
                step="0.01"
                placeholder="Importe"
                value={iImporte}
                onChange={(e) => setIImporte(e.target.value)}
              />
              <Input
                className="max-w-xs"
                placeholder="Descripción"
                value={iDesc}
                onChange={(e) => setIDesc(e.target.value)}
                required
              />
              <Button type="submit">Agregar ingreso</Button>
            </div>
          </form>
        </Card>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <h3 className="mb-2 font-semibold">Gastos</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead className="text-right">Importe</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {gastos.map((g) => (
                <TableRow key={String(g.idGasto)}>
                  <TableCell>{g.fecha ? String(g.fecha).slice(0, 10) : ''}</TableCell>
                  <TableCell>{String(g.descripcion ?? '')}</TableCell>
                  <TableCell className="text-right">{String(g.importe ?? '')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div>
          <h3 className="mb-2 font-semibold">Ingresos</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead className="text-right">Importe</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ingresos.map((i) => (
                <TableRow key={String(i.idIngreso)}>
                  <TableCell>{i.fecha ? String(i.fecha).slice(0, 10) : ''}</TableCell>
                  <TableCell>{String(i.descripcion ?? '')}</TableCell>
                  <TableCell className="text-right">{String(i.importe ?? '')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </main>
  );
}
