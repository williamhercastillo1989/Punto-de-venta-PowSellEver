import { useEffect, useState } from 'react';
import { Mail, Save, Send } from 'lucide-react';
import { enviarReporteCorreo, guardarCorreo, obtenerCorreo } from '../api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';

function hoy(): string {
  return new Date().toISOString().slice(0, 10);
}

export function CorreoView(): JSX.Element {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [para, setPara] = useState('');
  const [desde, setDesde] = useState(hoy());
  const [hasta, setHasta] = useState(hoy());
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    obtenerCorreo()
      .then((c) => setCorreo((c?.correo as string) ?? ''))
      .catch((e: Error) => setError(e.message));
  }, []);

  async function guardar(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setError(null);
    try {
      await guardarCorreo({ correo, password, estadoEnvio: 'ACTIVO' });
      setMsg('Configuración guardada.');
      setPassword('');
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function enviar(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setError(null);
    try {
      await enviarReporteCorreo(para, desde, hasta);
      setMsg(`Reporte enviado a ${para}.`);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <main className="min-h-full bg-background p-5">
      <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
        <Mail className="size-5" /> Correo
      </h2>
      {error && <Alert variant="error" className="mb-3">{error}</Alert>}
      {msg && <Alert variant="success" className="mb-3">{msg}</Alert>}
      <Card className="mb-4 p-4">
        <form className="flex flex-wrap items-center gap-3" onSubmit={guardar}>
          <Input
            className="max-w-xs"
            placeholder="Correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />
          <Input
            className="max-w-xs"
            type="password"
            placeholder="Contraseña / App password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit">
            <Save /> Guardar config
          </Button>
        </form>
      </Card>
      <Card className="p-4">
        <form className="flex flex-wrap items-end gap-3" onSubmit={enviar}>
          <Input
            className="max-w-xs"
            placeholder="Enviar reporte a (correo)"
            value={para}
            onChange={(e) => setPara(e.target.value)}
            required
          />
          <div className="grid gap-1.5">
            <Label>Desde</Label>
            <Input type="date" value={desde} onChange={(e) => setDesde(e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label>Hasta</Label>
            <Input type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} />
          </div>
          <Button type="submit">
            <Send /> Enviar PDF
          </Button>
        </form>
      </Card>
    </main>
  );
}
