import { useEffect, useMemo, useState } from 'react';
import { Camera, Pencil, Plus, Save, Search, Trash2 } from 'lucide-react';
import type { UsuarioDTO } from '@pos/types';
import {
  actualizarUsuario,
  crearUsuario,
  eliminarUsuario,
  obtenerUsuarios,
} from '../api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const ROLES = [
  { valor: 'Administrador', label: 'Administrador (acceso total)' },
  { valor: 'Cajero', label: 'Cajero (si está autorizado para manejar la caja)' },
];

interface FormState {
  idUsuario: number | null; // null = nuevo
  nombres: string;
  login: string;
  password: string;
  correo: string;
  rol: string;
  foto: string; // data URL (base64) o ''
  fotoNueva: boolean; // true si se cargó una imagen en esta edición
}

const FORM_VACIO: FormState = {
  idUsuario: null,
  nombres: '',
  login: '',
  password: '',
  correo: '',
  rol: 'Cajero',
  foto: '',
  fotoNueva: false,
};

/** Avatar con las iniciales del nombre (no guardamos foto en el POS moderno). */
function iniciales(nombre: string): string {
  const partes = nombre.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return '👤';
  return (partes[0][0] + (partes[1]?.[0] ?? '')).toUpperCase();
}

export function UsuariosView(): JSX.Element {
  const [items, setItems] = useState<UsuarioDTO[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [form, setForm] = useState<FormState | null>(null); // null = modo lista

  function cargar(): void {
    obtenerUsuarios()
      .then(setItems)
      .catch((e: Error) => setError(e.message));
  }
  useEffect(cargar, []);

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return items;
    return items.filter((u) =>
      [u.nombres, u.login, u.correo, u.rol]
        .map((v) => (v ?? '').toLowerCase())
        .some((v) => v.includes(q)),
    );
  }, [items, busqueda]);

  function nuevo(): void {
    setError(null);
    setForm({ ...FORM_VACIO });
  }

  function editar(u: UsuarioDTO): void {
    setError(null);
    setForm({
      idUsuario: u.idUsuario,
      nombres: u.nombres ?? '',
      login: u.login ?? '',
      password: u.password ?? '',
      correo: u.correo ?? '',
      rol: u.rol ?? 'Cajero',
      foto: u.foto ?? '',
      fotoNueva: false,
    });
  }

  async function guardar(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    if (!form) return;
    setError(null);

    // Validación propia (sin depender de la del navegador, que bloquea en silencio).
    if (!form.nombres.trim()) return setError('El nombre es obligatorio.');
    if (!form.login.trim()) return setError('El usuario (login) es obligatorio.');
    if (form.idUsuario == null && form.password.length < 4) {
      return setError('La contraseña debe tener al menos 4 caracteres.');
    }
    if (form.correo.trim() && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.correo.trim())) {
      return setError('El correo no tiene un formato válido.');
    }

    try {
      if (form.idUsuario == null) {
        await crearUsuario({
          nombres: form.nombres,
          login: form.login,
          password: form.password,
          correo: form.correo,
          rol: form.rol,
          ...(form.foto ? { foto: form.foto } : {}),
        });
      } else {
        await actualizarUsuario(form.idUsuario, {
          nombres: form.nombres,
          login: form.login,
          correo: form.correo,
          rol: form.rol,
          // Solo enviamos contraseña si se escribió algo (evita pisarla por vacío).
          ...(form.password ? { password: form.password } : {}),
          // La foto solo se reenvía si se cargó una nueva en esta edición.
          ...(form.fotoNueva && form.foto ? { foto: form.foto } : {}),
        });
      }
      setForm(null);
      cargar();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function baja(id: number, nombre: string): Promise<void> {
    if (!window.confirm(`¿Eliminar al usuario "${nombre}"?`)) return;
    setError(null);
    try {
      await eliminarUsuario(id);
      cargar();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <div className="min-h-full bg-background">
      <header className="border-b px-5 pt-4">
        <h2 className="mb-3 text-xl font-bold">USUARIOS</h2>
      </header>

      <div className="relative p-5">
        <div className="relative mb-4 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            className="pl-9"
            placeholder="Buscar usuario…"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        {error && <Alert variant="error" className="mb-3">{error}</Alert>}

        {form ? (
          <FormularioUsuario
            form={form}
            setForm={setForm}
            onGuardar={guardar}
            onVolver={() => setForm(null)}
          />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead aria-label="acciones" className="w-24" />
                  <TableHead>Nombres</TableHead>
                  <TableHead>Login</TableHead>
                  <TableHead>Password</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtrados.map((u) => (
                  <TableRow key={u.idUsuario} onDoubleClick={() => editar(u)}>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Editar"
                          onClick={() => editar(u)}
                        >
                          <Pencil />
                        </Button>
                        {u.login !== 'admin' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            title="Eliminar"
                            onClick={() => baja(u.idUsuario, u.nombres ?? '')}
                          >
                            <Trash2 />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <button
                        className="font-medium text-primary underline-offset-4 hover:underline"
                        onClick={() => editar(u)}
                      >
                        {u.nombres}
                      </button>
                    </TableCell>
                    <TableCell>{u.login}</TableCell>
                    <TableCell>{u.password}</TableCell>
                  </TableRow>
                ))}
                {filtrados.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-muted-foreground">
                      Sin usuarios.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            <Button
              size="icon"
              className="fixed bottom-8 right-8 size-14 rounded-full shadow-lg"
              title="Agregar usuario"
              onClick={nuevo}
            >
              <Plus className="size-6" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

function FormularioUsuario({
  form,
  setForm,
  onGuardar,
  onVolver,
}: {
  form: FormState;
  setForm: (f: FormState) => void;
  onGuardar: (e: React.FormEvent) => void;
  onVolver: () => void;
}): JSX.Element {
  const set = (campo: keyof FormState, valor: string): void =>
    setForm({ ...form, [campo]: valor });

  function elegirFoto(e: React.ChangeEvent<HTMLInputElement>): void {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () =>
      setForm({ ...form, foto: String(reader.result), fotoNueva: true });
    reader.readAsDataURL(file);
  }

  return (
    <Card>
      <form className="p-6" onSubmit={onGuardar} noValidate>
        <div className="flex flex-wrap gap-8">
          <div className="flex min-w-72 flex-1 flex-col gap-3">
            <div className="grid gap-1.5">
              <Label>Nombres y Apellidos:</Label>
              <Input
                value={form.nombres}
                onChange={(e) => set('nombres', e.target.value)}
                autoFocus
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Usuario:</Label>
              <Input value={form.login} onChange={(e) => set('login', e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label>Contraseña:</Label>
              <Input
                value={form.password}
                onChange={(e) => set('password', e.target.value)}
                placeholder={form.idUsuario ? '(dejar vacío para no cambiar)' : ''}
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Correo electrónico:</Label>
              <Input
                type="text"
                value={form.correo}
                onChange={(e) => set('correo', e.target.value)}
              />
              <small className="text-muted-foreground">Servirá para recuperar su contraseña</small>
            </div>
            <div className="grid gap-1.5">
              <Label>Rol:</Label>
              <Select value={form.rol} onValueChange={(v) => set('rol', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => (
                    <SelectItem key={r.valor} value={r.valor}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3">
            {form.foto ? (
              <img
                className="size-32 rounded-full object-cover"
                src={form.foto}
                alt="Foto del usuario"
              />
            ) : (
              <div className="flex size-32 items-center justify-center rounded-full bg-muted text-3xl font-semibold text-muted-foreground">
                {iniciales(form.nombres)}
              </div>
            )}
            <Button variant="outline" asChild>
              <label className="cursor-pointer">
                <Camera /> {form.foto ? 'Cambiar foto' : 'Subir foto'}
                <input type="file" accept="image/*" onChange={elegirFoto} hidden />
              </label>
            </Button>
            {form.idUsuario != null && (
              <span className="text-sm text-muted-foreground">#{form.idUsuario}</span>
            )}
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Button type="submit">
            <Save /> Guardar Cambios
          </Button>
          <Button type="button" variant="ghost" onClick={onVolver}>
            Volver
          </Button>
        </div>
      </form>
    </Card>
  );
}
