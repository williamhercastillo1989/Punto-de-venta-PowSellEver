import { useEffect, useState } from 'react';
import { Check, Loader2, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Props {
  onFinish: () => void;
}

type Paso =
  | 'tipo'
  | 'sql'
  | 'empresa'
  | 'admin'
  | 'instalando'
  | 'listo'
  | 'servidor';

const PAISES: { pais: string; moneda: string }[] = [
  { pais: 'México', moneda: 'MXN' },
  { pais: 'Perú', moneda: 'PEN' },
  { pais: 'Costa Rica', moneda: 'CRC' },
  { pais: 'Guatemala', moneda: 'GTQ' },
  { pais: 'Honduras', moneda: 'HNL' },
  { pais: 'Nicaragua', moneda: 'NIO' },
  { pais: 'Panamá', moneda: 'USD' },
  { pais: 'Cuba', moneda: 'CUP' },
  { pais: 'Puerto Rico', moneda: 'USD' },
  { pais: 'Colombia', moneda: 'COP' },
];

export function SetupWizard({ onFinish }: Props): JSX.Element {
  const [paso, setPaso] = useState<Paso>('tipo');
  const [error, setError] = useState<string | null>(null);

  // SQL
  const [host, setHost] = useState('localhost');
  const [puerto, setPuerto] = useState('1433');
  const [sqlUser, setSqlUser] = useState('sa');
  // Debe coincidir con la contraseña que fija el instalador (installer.nsh).
  const [sqlPass, setSqlPass] = useState('Ada369$ecure1');
  const [probando, setProbando] = useState(false);

  // Empresa
  const [nombre, setNombre] = useState('');
  const [paisIdx, setPaisIdx] = useState(0);
  const [moneda, setMoneda] = useState('MXN');
  const [conImpuestos, setConImpuestos] = useState(false);
  const [pctImpuesto, setPctImpuesto] = useState('16');
  const [modoBusqueda, setModoBusqueda] = useState<'LECTORA' | 'TECLADO'>('LECTORA');
  const [nombreCaja, setNombreCaja] = useState('Caja 1');
  const [carpeta, setCarpeta] = useState('');
  const [correo, setCorreo] = useState('');

  // Admin
  const [cajero, setCajero] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [adminPass2, setAdminPass2] = useState('');

  // Secundaria
  const [servidorUrl, setServidorUrl] = useState('http://');

  // Progreso
  const [progreso, setProgreso] = useState<{ etapa: string; hecho?: number; total?: number }>({
    etapa: 'Preparando…',
  });

  useEffect(() => {
    const off = window.posAPI.setup.onProgreso(setProgreso);
    return off;
  }, []);

  async function probarSql(): Promise<void> {
    setError(null);
    setProbando(true);
    try {
      const r = await window.posAPI.setup.probar({
        host,
        port: Number(puerto) || 1433,
        user: sqlUser,
        password: sqlPass,
      });
      if (!r.ok) {
        setError(r.error ?? 'No se pudo conectar a SQL Server.');
        return;
      }
      setPaso('empresa');
    } finally {
      setProbando(false);
    }
  }

  async function instalar(): Promise<void> {
    setError(null);
    if (!nombre.trim()) {
      setPaso('empresa');
      return setError('Indica el nombre de la empresa.');
    }
    if (adminPass.length < 3) return setError('La contraseña debe tener al menos 3 dígitos.');
    if (adminPass !== adminPass2) return setError('Las contraseñas no coinciden.');

    setPaso('instalando');
    try {
      await window.posAPI.setup.instalarPrincipal({
        sql: { host, port: Number(puerto) || 1433, user: sqlUser, password: sqlPass },
        empresa: {
          nombre,
          pais: PAISES[paisIdx].pais,
          moneda,
          conImpuestos,
          porcentajeImpuesto: conImpuestos ? Number(pctImpuesto) || 0 : 0,
          modoBusqueda,
          nombreCaja,
          carpetaCopias: carpeta,
          correoCierre: correo,
        },
        admin: { nombre: cajero, password: adminPass },
      });
      setPaso('listo');
    } catch (e) {
      setError((e as Error).message);
      setPaso('admin');
    }
  }

  async function instalarSecundaria(): Promise<void> {
    setError(null);
    if (!/^https?:\/\/.+/.test(servidorUrl)) {
      return setError('Ingresa la dirección del servidor (ej. http://192.168.1.50:3000).');
    }
    try {
      await window.posAPI.setup.instalarSecundaria(servidorUrl);
      setPaso('listo');
    } catch (e) {
      setError((e as Error).message);
    }
  }

  /* ---------- Paso 1: tipo de equipo ---------- */
  if (paso === 'tipo') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-neutral-900 p-6 text-white">
        <header className="text-2xl font-bold">ADA 369 🍬</header>
        <h1 className="text-xl font-semibold">¿Esta Computadora es?</h1>
        <div className="grid gap-4 sm:grid-cols-2">
          <button
            className="flex flex-col gap-2 rounded-xl border border-white/20 bg-white/5 p-6 text-left transition-colors hover:border-primary hover:bg-white/10"
            onClick={() => setPaso('sql')}
          >
            <span className="text-lg font-semibold">Principal</span>
            <span className="text-sm text-white/70">
              Esta computadora debe estar encendida para que las secundarias se
              conecten. Tiene la base de datos.
            </span>
          </button>
          <button
            className="flex flex-col gap-2 rounded-xl border border-white/20 bg-white/5 p-6 text-left transition-colors hover:border-primary hover:bg-white/10"
            onClick={() => setPaso('servidor')}
          >
            <span className="text-lg font-semibold">Secundaria</span>
            <span className="text-sm text-white/70">
              Se conecta a la computadora Principal (siempre que esté encendida).
            </span>
          </button>
        </div>
      </div>
    );
  }

  /* ---------- Paso 2: conexión SQL (Principal) ---------- */
  if (paso === 'sql') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-neutral-900 p-6 text-white">
        <header className="text-2xl font-bold">ADA 369 🍬</header>
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col gap-3 p-6">
            <h2 className="text-lg font-semibold">Conexión a SQL Server</h2>
            <p className="text-sm text-muted-foreground">
              Datos de tu instancia de SQL Server (la instala el instalador con el
              usuario <strong>sa</strong>).
            </p>
            {error && <Alert variant="error">{error}</Alert>}
            <div className="grid gap-1.5">
              <Label>Servidor</Label>
              <Input value={host} onChange={(e) => setHost(e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label>Puerto</Label>
              <Input value={puerto} onChange={(e) => setPuerto(e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label>Usuario</Label>
              <Input value={sqlUser} onChange={(e) => setSqlUser(e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label>Contraseña</Label>
              <Input type="password" value={sqlPass} onChange={(e) => setSqlPass(e.target.value)} />
            </div>
            <div className="flex justify-between gap-3 pt-2">
              <Button variant="outline" onClick={() => setPaso('tipo')}>Atrás</Button>
              <Button onClick={probarSql} disabled={probando}>
                {probando ? 'Buscando instancia…' : 'Continuar →'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  /* ---------- Paso 3: empresa ---------- */
  if (paso === 'empresa') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-primary p-6">
        <Card className="w-full max-w-lg">
          <CardContent className="flex flex-col gap-3 p-6">
            <div className="mx-auto flex h-20 w-32 items-center justify-center rounded-md border-2 border-dashed border-border text-sm text-muted-foreground">
              TU LOGO AQUÍ
            </div>
            <h2 className="text-center text-lg font-bold">NOMBRE DE TU EMPRESA</h2>
            {error && <Alert variant="error">{error}</Alert>}
            <div className="grid gap-1.5">
              <Label>Nombre</Label>
              <Input value={nombre} onChange={(e) => setNombre(e.target.value)} />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="grid gap-1.5">
                <Label>País</Label>
                <Select
                  value={String(paisIdx)}
                  onValueChange={(v) => {
                    const i = Number(v);
                    setPaisIdx(i);
                    setMoneda(PAISES[i].moneda);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAISES.map((p, i) => (
                      <SelectItem key={p.pais} value={String(i)}>{p.pais}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1.5">
                <Label>Moneda</Label>
                <Input value={moneda} onChange={(e) => setMoneda(e.target.value)} />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={conImpuestos}
                onCheckedChange={(v) => setConImpuestos(Boolean(v))}
              />
              Vendes con impuestos
            </label>
            {conImpuestos && (
              <div className="grid gap-1.5">
                <Label>% Impuesto</Label>
                <Input value={pctImpuesto} onChange={(e) => setPctImpuesto(e.target.value)} />
              </div>
            )}
            <fieldset className="rounded-lg border px-4 py-2">
              <legend className="px-1 text-sm font-semibold">¿Cómo buscarás tus productos?</legend>
              <RadioGroup
                value={modoBusqueda}
                onValueChange={(v) => setModoBusqueda(v as 'LECTORA' | 'TECLADO')}
              >
                <label className="flex items-center gap-2 text-sm">
                  <RadioGroupItem value="LECTORA" /> Con una lectora de barras
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <RadioGroupItem value="TECLADO" /> Escribiendo con mi teclado
                </label>
              </RadioGroup>
            </fieldset>
            <div className="grid gap-1.5">
              <Label>CAJA: Nombre de caja</Label>
              <Input value={nombreCaja} onChange={(e) => setNombreCaja(e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label>Carpeta para copias de seguridad</Label>
              <Input value={carpeta} onChange={(e) => setCarpeta(e.target.value)} placeholder="C:\\POS\\Respaldos" />
            </div>
            <div className="grid gap-1.5">
              <Label>Correo para reporte de cierre de caja</Label>
              <Input value={correo} onChange={(e) => setCorreo(e.target.value)} />
            </div>
            <div className="flex justify-between gap-3 pt-2">
              <Button variant="outline" onClick={() => setPaso('sql')}>Atrás</Button>
              <Button
                onClick={() => {
                  if (!nombre.trim()) return setError('Indica el nombre de la empresa.');
                  setError(null);
                  setPaso('admin');
                }}
              >
                Siguiente →
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  /* ---------- Paso 4: usuario administrador ---------- */
  if (paso === 'admin') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-primary p-6">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col gap-3 p-6">
            <h2 className="text-lg font-semibold">¿Qué cajero principal usará el programa?</h2>
            {error && <Alert variant="error">{error}</Alert>}
            <div className="grid gap-1.5">
              <Label>Nombre del cajero(a)</Label>
              <Input value={cajero} onChange={(e) => setCajero(e.target.value)} autoFocus />
            </div>
            <div className="grid gap-1.5">
              <Label>Usuario</Label>
              <Input value="admin" disabled />
            </div>
            <div className="grid gap-1.5">
              <Label>Contraseña (hasta 6 dígitos)</Label>
              <Input
                type="password"
                maxLength={6}
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Confirmar contraseña</Label>
              <Input
                type="password"
                maxLength={6}
                value={adminPass2}
                onChange={(e) => setAdminPass2(e.target.value)}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              El Administrador siempre tendrá acceso a todas las funciones del programa.
            </p>
            <div className="flex justify-between gap-3 pt-2">
              <Button variant="outline" onClick={() => setPaso('empresa')}>Atrás</Button>
              <Button onClick={instalar}>Finalizar →</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  /* ---------- Instalando (progreso) ---------- */
  if (paso === 'instalando') {
    const pct =
      progreso.total && progreso.hecho
        ? Math.round((progreso.hecho / progreso.total) * 100)
        : null;
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-neutral-900 p-6 text-center text-white">
        <Loader2 className="size-12 animate-spin text-primary" />
        <h2 className="text-xl font-semibold">No cierres esta ventana</h2>
        <p className="text-white/70">Se cerrará automáticamente cuando esté todo listo.</p>
        <p className="text-sm text-primary">{progreso.etapa}{pct != null ? ` (${pct}%)` : ''}</p>
      </div>
    );
  }

  /* ---------- Servidor (Secundaria) ---------- */
  if (paso === 'servidor') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-neutral-900 p-6 text-white">
        <header className="text-2xl font-bold">ADA 369 🍬</header>
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col gap-3 p-6">
            <h2 className="text-lg font-semibold">Conectar a la computadora Principal</h2>
            <p className="text-sm text-muted-foreground">Dirección de la API del equipo Principal.</p>
            {error && <Alert variant="error">{error}</Alert>}
            <div className="grid gap-1.5">
              <Label>Servidor</Label>
              <Input
                value={servidorUrl}
                onChange={(e) => setServidorUrl(e.target.value)}
                placeholder="http://192.168.1.50:3000"
              />
            </div>
            <div className="flex justify-between gap-3 pt-2">
              <Button variant="outline" onClick={() => setPaso('tipo')}>Atrás</Button>
              <Button onClick={instalarSecundaria}>Conectar →</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  /* ---------- Listo ---------- */
  return (
    <div className="flex min-h-screen items-center justify-center bg-primary p-6">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-success text-success-foreground">
            <Check className="size-8" />
          </div>
          <h2 className="text-xl font-semibold">¡Listo!</h2>
          <p>
            Recuerda que para iniciar sesión tu usuario es <strong>admin</strong>
            {paso === 'listo' && adminPass ? (
              <>
                {' '}y tu contraseña es <strong>{adminPass}</strong>
              </>
            ) : null}
            .
          </p>
          <Button onClick={onFinish}>
            <LogIn /> Ir al Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
