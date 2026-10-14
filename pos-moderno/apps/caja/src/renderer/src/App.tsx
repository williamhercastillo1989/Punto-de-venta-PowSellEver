import { useState } from 'react';
import { LogOut } from 'lucide-react';
import type { UsuarioAutenticadoDTO } from '@pos/types';
import { LoginView } from './auth/LoginView';
import { CajaGate } from './caja/CajaGate';
import { DashboardView } from './dashboard/DashboardView';
import { ConfiguracionesView } from './config/ConfiguracionesView';
import { SetupWizard } from './setup/SetupWizard';
import { ModuloView } from './modulos';
import { setToken } from './api';
import { Button } from '@/components/ui/button';

const ID_CAJA = 1;

function esAdministrador(u: UsuarioAutenticadoDTO): boolean {
  return (u.rol ?? '').toLowerCase().includes('admin');
}

// Rutas: 'dashboard' | 'caja' | 'config' | 'm:<modulo>'
type Vista = string;

export function App(): JSX.Element {
  const [usuario, setUsuario] = useState<UsuarioAutenticadoDTO | null>(null);
  const [vista, setVista] = useState<Vista>('caja');
  const [origenModulo, setOrigenModulo] = useState<Vista>('dashboard');
  // Primera ejecución: si no está instalado, mostramos el asistente.
  const [instalado, setInstalado] = useState<boolean>(() => {
    try {
      return window.posAPI?.config?.instalado?.() ?? true;
    } catch {
      return true;
    }
  });

  if (!instalado) {
    return <SetupWizard onFinish={() => setInstalado(true)} />;
  }

  function alIniciarSesion(u: UsuarioAutenticadoDTO): void {
    setToken(u.token);
    void window.posAPI.auth.setToken(u.token);
    setVista(esAdministrador(u) ? 'dashboard' : 'caja');
    setUsuario(u);
  }
  function salir(): void {
    setToken(null);
    void window.posAPI.auth.setToken(null);
    setUsuario(null);
  }

  if (!usuario) return <LoginView onLogin={alIniciarSesion} />;

  const admin = esAdministrador(usuario);

  function abrirModulo(key: string, origen: Vista): void {
    setOrigenModulo(origen);
    setVista(`m:${key}`);
  }

  // --- Dashboard (solo admin) ---
  if (vista === 'dashboard' && admin) {
    return (
      <DashboardView
        usuario={usuario}
        onSalir={salir}
        onIr={(key) => {
          if (key === 'ventas') setVista('caja');
          else if (key === 'config') setVista('config');
          else abrirModulo(key ?? 'ventas', 'dashboard');
        }}
      />
    );
  }

  // --- Configuraciones (solo admin) ---
  if (vista === 'config' && admin) {
    return (
      <ConfiguracionesView
        onAbrir={(k) => abrirModulo(k, 'config')}
        onVolver={() => setVista('dashboard')}
      />
    );
  }

  // --- Módulo individual ---
  if (vista.startsWith('m:')) {
    return (
      <ModuloView
        moduloKey={vista.slice(2)}
        idCaja={ID_CAJA}
        idUsuario={usuario.idUsuario}
        onVolver={() => setVista(origenModulo)}
      />
    );
  }

  // --- Caja (POS) — todos los roles ---
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center gap-4 border-b bg-card px-5 py-3">
        <h1 className="text-lg font-bold">POS — Punto de Venta</h1>
        <span className="ml-auto flex items-center gap-2 text-sm">
          {usuario.foto ? (
            <img className="size-8 rounded-full object-cover" src={usuario.foto} alt="" />
          ) : (
            <span className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
              {(usuario.nombres ?? usuario.login ?? '?').trim().charAt(0).toUpperCase()}
            </span>
          )}
          {usuario.nombres ?? usuario.login} · {usuario.rol ?? 'sin rol'}
        </span>
        <Button variant="outline" size="sm" onClick={salir}>
          <LogOut /> Salir
        </Button>
      </header>
      <CajaGate
        idCaja={ID_CAJA}
        usuario={usuario}
        onIr={(key) => abrirModulo(key, 'caja')}
        onInicio={admin ? () => setVista('dashboard') : undefined}
      />
    </div>
  );
}
