import { useCallback, useEffect, useState } from 'react';
import { BarChart3, FileSpreadsheet, FileText, Search } from 'lucide-react';
import {
  descargarReporteExcel,
  descargarReportePdf,
  reporteVentas,
  type ReporteVentasResp,
} from '../api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

function hoy(): string {
  return new Date().toISOString().slice(0, 10);
}
function haceUnMes(): string {
  const d = new Date();
  d.setMonth(d.getMonth() - 1);
  return d.toISOString().slice(0, 10);
}

export function ReportesView(): JSX.Element {
  const [desde, setDesde] = useState(haceUnMes());
  const [hasta, setHasta] = useState(hoy());
  const [data, setData] = useState<ReporteVentasResp | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(() => {
    reporteVentas(desde, hasta).then(setData).catch((e: Error) => setError(e.message));
  }, [desde, hasta]);

  useEffect(cargar, [cargar]);

  return (
    <main className="min-h-full bg-background p-5">
      <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
        <BarChart3 className="size-5" /> Reporte de ventas
      </h2>
      {error && <Alert variant="error" className="mb-3">{error}</Alert>}
      <div className="mb-4 flex flex-wrap items-end gap-3">
        <div className="grid gap-1.5">
          <Label>Desde</Label>
          <Input type="date" value={desde} onChange={(e) => setDesde(e.target.value)} />
        </div>
        <div className="grid gap-1.5">
          <Label>Hasta</Label>
          <Input type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} />
        </div>
        <Button onClick={cargar}>
          <Search /> Consultar
        </Button>
        <Button variant="outline" onClick={() => void descargarReporteExcel(desde, hasta)}>
          <FileSpreadsheet /> Exportar Excel
        </Button>
        <Button variant="outline" onClick={() => void descargarReportePdf(desde, hasta)}>
          <FileText /> Exportar PDF
        </Button>
      </div>
      {data && (
        <>
          <div className="mb-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{data.resumen.numVentas}</div>
                <div className="text-sm text-muted-foreground">Ventas</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{data.resumen.total.toFixed(2)}</div>
                <div className="text-sm text-muted-foreground">Total</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{data.resumen.efectivo.toFixed(2)}</div>
                <div className="text-sm text-muted-foreground">Efectivo</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{data.resumen.tarjeta.toFixed(2)}</div>
                <div className="text-sm text-muted-foreground">Tarjeta</div>
              </CardContent>
            </Card>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Comprobante</TableHead>
                <TableHead>Cajero</TableHead>
                <TableHead>Pago</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.filas.map((f) => (
                <TableRow key={String(f.idVenta)}>
                  <TableCell>{String(f.idVenta)}</TableCell>
                  <TableCell>{f.fecha ? String(f.fecha).slice(0, 10) : ''}</TableCell>
                  <TableCell>{String(f.comprobante ?? '')} {String(f.numeroDoc ?? '')}</TableCell>
                  <TableCell>{String(f.cajero ?? '')}</TableCell>
                  <TableCell>{String(f.tipoPago ?? '')}</TableCell>
                  <TableCell className="text-right">{Number(f.montoTotal ?? 0).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}
    </main>
  );
}
