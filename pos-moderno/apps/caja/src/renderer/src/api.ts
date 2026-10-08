import type {
  AjusteInventarioDTO,
  AperturaCajaDTO,
  CierreCajaDTO,
  CrearProveedorDTO,
  InventarioItemDTO,
  LoginDTO,
  ProductoDTO,
  ProveedorDTO,
  RegistrarCompraDTO,
  TurnoAbiertoDTO,
  UsuarioAutenticadoDTO,
} from '@pos/types';

/**
 * Cliente de la API del POS. La URL base se podrá configurar por caja;
 * por ahora apunta al servidor NestJS local (Fase 0).
 */
const API_BASE = 'http://localhost:3000';

async function post<T>(ruta: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${ruta}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(data.message ?? `Error HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export function login(dto: LoginDTO): Promise<UsuarioAutenticadoDTO> {
  return post<UsuarioAutenticadoDTO>('/auth/login', dto);
}

export function aperturaCaja(dto: AperturaCajaDTO): Promise<unknown> {
  return post('/caja/apertura', dto);
}

export function cierreCaja(dto: CierreCajaDTO): Promise<unknown> {
  return post('/caja/cierre', dto);
}

export async function turnoAbierto(
  idCaja: number,
): Promise<TurnoAbiertoDTO | null> {
  const res = await fetch(`${API_BASE}/caja/${idCaja}/turno-abierto`);
  if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
  const texto = await res.text();
  return texto ? (JSON.parse(texto) as TurnoAbiertoDTO) : null;
}

// ---- Inventario / Kardex ----

async function get<T>(ruta: string): Promise<T> {
  const res = await fetch(`${API_BASE}${ruta}`);
  if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
  return res.json() as Promise<T>;
}

export function obtenerInventario(q = ''): Promise<InventarioItemDTO[]> {
  return get<InventarioItemDTO[]>(`/inventario?q=${encodeURIComponent(q)}`);
}

export function inventarioBajoMinimo(): Promise<InventarioItemDTO[]> {
  return get<InventarioItemDTO[]>('/inventario/bajo-minimo');
}

export function ajusteInventario(dto: AjusteInventarioDTO): Promise<unknown> {
  return post('/inventario/ajuste', dto);
}

// ---- Proveedores ----

export function obtenerProveedores(): Promise<ProveedorDTO[]> {
  return get<ProveedorDTO[]>('/proveedores');
}

export function crearProveedor(dto: CrearProveedorDTO): Promise<unknown> {
  return post('/proveedores', dto);
}

// ---- Compras ----

export function registrarCompra(
  dto: RegistrarCompraDTO,
): Promise<{ idCompra: number; total: number }> {
  return post('/compras', dto);
}

export async function obtenerProductos(): Promise<ProductoDTO[]> {
  const res = await fetch(`${API_BASE}/productos`);
  if (!res.ok) throw new Error(`Error al cargar productos (HTTP ${res.status})`);
  // La API devuelve el modelo Prisma; lo adaptamos al DTO compartido.
  const filas = (await res.json()) as Array<Record<string, unknown>>;
  return filas.map((f) => ({
    id: Number(f.idProducto),
    descripcion: (f.descripcion as string) ?? null,
    codigo: (f.codigo as string) ?? null,
    idGrupo: (f.idGrupo as number) ?? null,
    usaInventarios: (f.usaInventarios as string) ?? null,
    stock: (f.stock as string) ?? null,
    precioCompra: f.precioDeCompra != null ? Number(f.precioDeCompra) : null,
    precioVenta: f.precioDeVenta != null ? Number(f.precioDeVenta) : null,
    precioMayoreo: f.precioMayoreo != null ? Number(f.precioMayoreo) : null,
    impuesto: (f.impuesto as string) ?? null,
    stockMinimo: f.stockMinimo != null ? Number(f.stockMinimo) : null,
    subTotalPv: null,
    subTotalPm: null,
  }));
}
