import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { crearSerie, eliminarSerie, obtenerSeries } from '../api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export function ComprobantesView(): JSX.Element {
  const [series, setSeries] = useState<Array<Record<string, unknown>>>([]);
  const [error, setError] = useState<string | null>(null);
  const [serie, setSerie] = useState('');
  const [tipoDoc, setTipoDoc] = useState('TICKET');

  function cargar(): void {
    obtenerSeries().then(setSeries).catch((e: Error) => setError(e.message));
  }
  useEffect(cargar, []);

  async function crear(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setError(null);
    try {
      await crearSerie({ serie, tipoDoc, numeroFin: '0', porDefecto: 'NO' });
      setSerie('');
      cargar();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function eliminar(id: number): Promise<void> {
    try {
      await eliminarSerie(id);
      cargar();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <main className="min-h-full bg-background p-5">
      <h2 className="mb-4 text-xl font-bold">Serialización de comprobantes</h2>
      {error && <Alert variant="error" className="mb-3">{error}</Alert>}
      <Card className="mb-4 flex flex-wrap items-center gap-3 p-4">
        <form className="flex flex-wrap items-center gap-3" onSubmit={crear}>
          <Input
            className="max-w-xs"
            placeholder="Serie (ej. TC)"
            value={serie}
            onChange={(e) => setSerie(e.target.value)}
            required
          />
          <Input
            className="max-w-xs"
            placeholder="Tipo de documento"
            value={tipoDoc}
            onChange={(e) => setTipoDoc(e.target.value)}
          />
          <Button type="submit">
            <Plus /> Agregar
          </Button>
        </form>
      </Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Serie</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead className="text-right">Último nº</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {series.map((s) => (
            <TableRow key={String(s.idSerializacion)}>
              <TableCell>{String(s.idSerializacion)}</TableCell>
              <TableCell>{String(s.serie ?? '')}</TableCell>
              <TableCell>{String(s.tipoDoc ?? '')}</TableCell>
              <TableCell className="text-right">{String(s.numeroFin ?? '')}</TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => eliminar(Number(s.idSerializacion))}
                >
                  <Trash2 /> Eliminar
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {series.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-muted-foreground">
                Sin series registradas.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </main>
  );
}
