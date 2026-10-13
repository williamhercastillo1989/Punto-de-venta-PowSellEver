import { useState } from 'react';
import { LogIn } from 'lucide-react';
import type { UsuarioAutenticadoDTO } from '@pos/types';
import { login } from '../api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  onLogin: (usuario: UsuarioAutenticadoDTO) => void;
}

export function LoginView({ onLogin }: Props): JSX.Element {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  async function entrar(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setError(null);
    setCargando(true);
    try {
      const u = await login({ login: usuario, password });
      onLogin(u);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Iniciar sesión</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={entrar}>
            {error && <Alert variant="error">{error}</Alert>}
            <div className="grid gap-1.5">
              <Label htmlFor="login-usuario">Usuario</Label>
              <Input
                id="login-usuario"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                autoFocus
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="login-password">Contraseña</Label>
              <Input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={cargando}>
              <LogIn /> {cargando ? 'Entrando…' : 'Entrar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
