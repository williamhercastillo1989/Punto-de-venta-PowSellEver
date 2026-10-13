import { useEffect, useState } from 'react';
import { Camera, FolderClosed, Save } from 'lucide-react';
import type { EmpresaDTO } from '@pos/types';
import {
  actualizarCajaPrincipal,
  actualizarEmpresa,
  guardarTicket,
  obtenerCajaPrincipal,
  obtenerEmpresa,
  obtenerTicket,
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

export function EmpresaView(): JSX.Element {
  const [emp, setEmp] = useState<EmpresaDTO | null>(null);
  const [nombreCaja, setNombreCaja] = useState('');
  const [idCaja, setIdCaja] = useState<number | null>(null);
  const [logo, setLogo] = useState('');
  const [logoNueva, setLogoNueva] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    obtenerEmpresa().then(setEmp).catch((e: Error) => setError(e.message));
    obtenerCajaPrincipal()
      .then((c) => {
        if (c) {
          setIdCaja(c.idCaja);
          setNombreCaja(c.descripcion ?? '');
        }
      })
      .catch(() => undefined);
    obtenerTicket()
      .then((t) => {
        const l = (t as { logo?: string })?.logo;
        if (typeof l === 'string') setLogo(l);
      })
      .catch(() => undefined);
  }, []);

  function set<K extends keyof EmpresaDTO>(k: K, v: EmpresaDTO[K]): void {
    setEmp((p) => (p ? { ...p, [k]: v } : p));
    setMsg(null);
  }

  function subirLogo(e: React.ChangeEvent<HTMLInputElement>): void {
    const f = e.target.files?.[0];
    if (!f || !f.type.startsWith('image/')) return;
    const r = new FileReader();
    r.onload = () => {
      setLogo(String(r.result));
      setLogoNueva(true);
    };
    r.readAsDataURL(f);
  }

  async function guardar(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    if (!emp) return;
    setError(null);
    try {
      const u = await actualizarEmpresa(emp.idEmpresa, emp);
      setEmp(u);
      if (idCaja && nombreCaja.trim()) await actualizarCajaPrincipal(nombreCaja.trim());
      if (logoNueva) await guardarTicket({ logo });
      setMsg('Configuración de empresa guardada.');
      setLogoNueva(false);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  if (error && !emp)
    return (
      <main className="min-h-full bg-background p-5">
        <h2 className="mb-3 text-xl font-bold">Empresa</h2>
        <Alert variant="error">{error}</Alert>
      </main>
    );
  if (!emp)
    return (
      <main className="min-h-full bg-background p-5">
        <h2 className="mb-3 text-xl font-bold">Empresa</h2>
        <p className="text-muted-foreground">No hay empresa configurada.</p>
      </main>
    );

  const conImpuestos = (emp.trabajasConImpuestos ?? '').toUpperCase() === 'SI';

  return (
    <div className="min-h-full bg-background p-5">
      <Card className="mx-auto w-full max-w-3xl">
        <form className="flex flex-col gap-5 p-6" onSubmit={guardar}>
          {error && <Alert variant="error">{error}</Alert>}
          {msg && <Alert variant="success">{msg}</Alert>}

          <div className="flex flex-wrap items-start gap-5">
            <label
              className="relative flex size-32 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-lg border bg-muted text-center text-xs text-muted-foreground"
              title="Subir logo"
            >
              {logo ? (
                <img src={logo} alt="logo" className="size-full object-cover" />
              ) : (
                <span>TU LOGO AQUÍ</span>
              )}
              <input type="file" accept="image/*" hidden onChange={subirLogo} />
              <span className="absolute bottom-1 right-1 flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Camera className="size-3.5" />
              </span>
            </label>
            <div className="flex min-w-60 flex-1 flex-col gap-3">
              <div className="grid gap-1.5">
                <Label>NOMBRE DE TU EMPRESA</Label>
                <Input
                  value={emp.nombreEmpresa ?? ''}
                  onChange={(e) => set('nombreEmpresa', e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="grid flex-1 gap-1.5">
                  <Label>País</Label>
                  <Select
                    value={emp.pais || undefined}
                    onValueChange={(v) => {
                      const p = PAISES.find((x) => x.pais === v);
                      set('pais', v);
                      if (p) set('moneda', p.moneda);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="—" />
                    </SelectTrigger>
                    <SelectContent>
                      {PAISES.map((p) => (
                        <SelectItem key={p.pais} value={p.pais}>
                          {p.pais}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid flex-1 gap-1.5">
                  <Label>Moneda</Label>
                  <Input value={emp.moneda ?? ''} onChange={(e) => set('moneda', e.target.value)} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-lg bg-muted p-4">
            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={conImpuestos}
                  onCheckedChange={(c) => set('trabajasConImpuestos', c === true ? 'SI' : 'NO')}
                />
                Vendes con impuestos
              </label>
              {conImpuestos && (
                <div className="flex items-center gap-2">
                  <Label>% Impuesto</Label>
                  <Input
                    type="number"
                    className="w-24"
                    value={emp.porcentajeImpuesto ?? 0}
                    onChange={(e) => set('porcentajeImpuesto', Number(e.target.value))}
                  />
                </div>
              )}
            </div>

            <fieldset className="rounded-lg border bg-background px-4 py-2">
              <legend className="px-1 text-sm font-semibold">¿Cómo buscarás tus productos?</legend>
              <RadioGroup
                value={emp.modoDeBusqueda ?? 'LECTORA'}
                onValueChange={(v) => set('modoDeBusqueda', v)}
              >
                <label className="flex items-center gap-2 text-sm">
                  <RadioGroupItem value="LECTORA" /> Con una lectora de barras
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <RadioGroupItem value="TECLADO" /> Escribiendo con mi teclado
                </label>
              </RadioGroup>
            </fieldset>
          </div>

          <div className="grid gap-1.5">
            <Label>CAJA: Nombre de caja</Label>
            <Input
              value={nombreCaja}
              onChange={(e) => {
                setNombreCaja(e.target.value);
                setMsg(null);
              }}
            />
          </div>

          <div className="flex flex-col gap-3">
            <div className="grid gap-1.5">
              <Label className="flex items-center gap-2">
                <FolderClosed className="size-4" /> Carpeta donde guardar las copias de seguridad
              </Label>
              <Input
                value={emp.carpetaParaCopias ?? ''}
                onChange={(e) => set('carpetaParaCopias', e.target.value)}
                placeholder="C:\POS\Respaldos"
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Correo para enviarte el reporte del cierre de caja</Label>
              <Input
                type="text"
                value={emp.correoParaReportes ?? ''}
                onChange={(e) => set('correoParaReportes', e.target.value)}
                placeholder="correo@ejemplo.com"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit">
              <Save /> Guardar
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
