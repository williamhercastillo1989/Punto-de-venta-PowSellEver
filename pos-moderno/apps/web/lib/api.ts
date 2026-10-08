import type {
  AjusteInventarioDTO,
  CrearProveedorDTO,
  InventarioItemDTO,
  LoginDTO,
  ProveedorDTO,
  RegistrarCompraDTO,
  UsuarioAutenticadoDTO,
} from '@pos/types';

// La API NestJS corre en el puerto 3000 (con CORS habilitado).
export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

export interface ReporteVentas {
  desde: string;
  hasta: string;
  resumen: {
    numVentas: number;
    total: number;
    efectivo: number;
    tarjeta: number;
    credito: number;
  };
  filas: Array<{
    idVenta: number;
    fecha: string | null;
    comprobante: string | null;
    numeroDoc: string | null;
    montoTotal: string | number | null;
    tipoPago: string | null;
    cajero: string | null;
  }>;
}

async function get<T>(ruta: string): Promise<T> {
  const res = await fetch(`${API_BASE}${ruta}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
  return res.json() as Promise<T>;
}

async function post<T>(ruta: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${ruta}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(
      Array.isArray(data.message)
        ? data.message.join(', ')
        : data.message ?? `Error HTTP ${res.status}`,
    );
  }
  return res.json() as Promise<T>;
}

export const api = {
  login: (dto: LoginDTO) =>
    post<UsuarioAutenticadoDTO>('/auth/login', dto),
  reporteVentas: (desde: string, hasta: string) =>
    get<ReporteVentas>(`/reportes/ventas?desde=${desde}&hasta=${hasta}`),
  inventario: (q = '') =>
    get<InventarioItemDTO[]>(`/inventario?q=${encodeURIComponent(q)}`),
  bajoMinimo: () => get<InventarioItemDTO[]>('/inventario/bajo-minimo'),
  ajuste: (dto: AjusteInventarioDTO) => post('/inventario/ajuste', dto),
  proveedores: () => get<ProveedorDTO[]>('/proveedores'),
  crearProveedor: (dto: CrearProveedorDTO) => post('/proveedores', dto),
  productos: () => get<Array<Record<string, unknown>>>('/productos'),
  compras: () => get<Array<Record<string, unknown>>>('/compras'),
  registrarCompra: (dto: RegistrarCompraDTO) =>
    post<{ idCompra: number; total: number }>('/compras', dto),
};
