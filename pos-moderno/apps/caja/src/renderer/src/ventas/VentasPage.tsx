import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type {
  ClienteDTO,
  ProductoDTO,
  RegistrarVentaDTO,
  UsuarioAutenticadoDTO,
} from '@pos/types';
import {
  obtenerClientes,
  obtenerEmpresa,
  obtenerProductos,
  obtenerTicket,
} from '../api';
import {
  Camera,
  CreditCard,
  Keyboard,
  Minus,
  Monitor,
  Moon,
  Pause,
  Play,
  Plus,
  Search,
  Sun,
  Trash2,
  Users,
  X,
} from 'lucide-react';
import { numeroALetras, DISENO_DEFAULT } from '../ticket/comprobante';
import { CobroModal, type DatosCobro } from './CobroModal';
import { TicketPreview, type TicketData } from './TicketPreview';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert } from '@/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface Props {
  idCaja: number;
  idUsuario: number;
  usuario?: UsuarioAutenticadoDTO;
  onIr?: (tab: string) => void;
  onCerrarTurno?: () => void;
}

interface LineaVenta {
  producto: ProductoDTO;
  cantidad: number;
  precioUnitario: number;
}

type Modo = 'lectora' | 'teclado';
const IVA = 0.16;

export function VentasPage({
  idCaja,
  idUsuario,
  usuario,
  onIr,
  onCerrarTurno,
}: Props): JSX.Element {
  const [productos, setProductos] = useState<ProductoDTO[]>([]);
  const [carrito, setCarrito] = useState<LineaVenta[]>([]);
  const [espera, setEspera] = useState<LineaVenta[][]>([]);
  const [modo, setModo] = useState<Modo>('lectora');
  const [busqueda, setBusqueda] = useState('');
  const [sel, setSel] = useState<number | null>(null);
  const [entrada, setEntrada] = useState('');
  const [mayoreo, setMayoreo] = useState(false);
  const [oscuro, setOscuro] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [clientes, setClientes] = useState<ClienteDTO[]>([]);
  const [empresaNombre, setEmpresaNombre] = useState('Mi Negocio');
  const [mostrarCobro, setMostrarCobro] = useState(false);
  const [docActual, setDocActual] = useState('');
  const [ticketData, setTicketData] = useState<TicketData | null>(null);
  const buscarRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    obtenerProductos().then(setProductos).catch((e: Error) => setError(e.message));
    obtenerClientes().then(setClientes).catch(() => undefined);
    obtenerEmpresa().then((e) => setEmpresaNombre((e?.nombreEmpresa as string) ?? 'Mi Negocio')).catch(() => undefined);
  }, []);
  useEffect(() => {
    buscarRef.current?.focus();
  }, [modo]);

  const precioDe = useCallback(
    (p: ProductoDTO): number =>
      mayoreo && p.precioMayoreo ? p.precioMayoreo : p.precioVenta ?? 0,
    [mayoreo],
  );

  const sugerencias = useMemo(() => {
    if (!busqueda.trim()) return [];
    const q = busqueda.toLowerCase();
    return productos
      .filter(
        (p) =>
          (p.descripcion ?? '').toLowerCase().includes(q) ||
          (p.codigo ?? '').toLowerCase().includes(q),
      )
      .slice(0, 8);
  }, [busqueda, productos]);

  const total = carrito.reduce((a, l) => a + l.cantidad * l.precioUnitario, 0);
  const subTotal = total / (1 + IVA);
  const iva = total - subTotal;

  const agregar = useCallback(
    (p: ProductoDTO, cantidad = 1): void => {
      setCarrito((prev) => {
        const i = prev.findIndex((l) => l.producto.id === p.id);
        if (i >= 0) {
          const c = [...prev];
          c[i] = { ...c[i], cantidad: c[i].cantidad + cantidad };
          return c;
        }
        return [...prev, { producto: p, cantidad, precioUnitario: precioDe(p) }];
      });
      setError(null);
      setMsg(null);
    },
    [precioDe],
  );

  function onBuscarKey(e: React.KeyboardEvent<HTMLInputElement>): void {
    if (e.key !== 'Enter') return;
    const q = busqueda.trim();
    if (!q) return;
    const ql = q.toLowerCase();
    const p =
      productos.find((x) => (x.codigo ?? '') === q) ??
      productos.find(
        (x) =>
          (x.descripcion ?? '').toLowerCase().includes(ql) ||
          (x.codigo ?? '').toLowerCase().includes(ql),
      );
    if (p) agregar(p);
    else setError(`No se encontró "${q}"`);
    setBusqueda('');
  }

  function cambiarCantidad(i: number, d: number): void {
    setCarrito((prev) =>
      prev
        .map((l, idx) => (idx === i ? { ...l, cantidad: Math.max(0, l.cantidad + d) } : l))
        .filter((l) => l.cantidad > 0),
    );
  }
  function quitar(i: number): void {
    setCarrito((prev) => prev.filter((_, idx) => idx !== i));
    setSel(null);
  }

  function tecla(d: string): void {
    setEntrada((e) => (d === ',' ? (e.includes('.') ? e : e + '.') : e + d));
  }
  function aplicar(campo: 'cantidad' | 'precio'): void {
    const v = Number(entrada);
    if (Number.isNaN(v) || sel == null) {
      setError('Selecciona una línea y escribe un número');
      return;
    }
    setCarrito((prev) =>
      prev.map((l, i) =>
        i === sel
          ? campo === 'cantidad'
            ? { ...l, cantidad: v }
            : { ...l, precioUnitario: v }
          : l,
      ),
    );
    setEntrada('');
  }

  function toggleMayoreo(): void {
    setMayoreo((m) => {
      const nm = !m;
      setCarrito((prev) =>
        prev.map((l) => ({
          ...l,
          precioUnitario:
            nm && l.producto.precioMayoreo
              ? l.producto.precioMayoreo
              : l.producto.precioVenta ?? 0,
        })),
      );
      return nm;
    });
  }

  function ponerEnEspera(): void {
    if (carrito.length === 0) return;
    setEspera((prev) => [...prev, carrito]);
    setCarrito([]);
    setMsg('Venta puesta en espera.');
  }
  function restaurar(): void {
    setEspera((prev) => {
      if (prev.length === 0) return prev;
      const ultima = prev[prev.length - 1];
      setCarrito(ultima);
      return prev.slice(0, -1);
    });
  }

  // Abre el modal de cobro (botón/F3).
  const cobrar = useCallback((): void => {
    if (carrito.length === 0) return;
    setDocActual(`T-${Date.now()}`);
    setMostrarCobro(true);
  }, [carrito.length]);

  // Confirma el cobro desde el modal: registra la venta y según el modo
  // imprime directo o muestra la vista del ticket.
  async function confirmarCobro(datos: DatosCobro): Promise<void> {
    setError(null);
    const tipoPago =
      datos.credito > 0
        ? 'Credito'
        : datos.tarjeta > 0 && datos.efectivo > 0
          ? 'Mixto'
          : datos.tarjeta > 0
            ? 'Tarjeta'
            : 'Efectivo';
    const venta: RegistrarVentaDTO = {
      idCaja,
      idUsuario,
      idCliente: datos.idCliente,
      tipoPago,
      numeroDeDoc: docActual,
      comprobante: datos.tipoDoc === 'FACTURA' ? 'FACTURA' : 'TICKET',
      montoTotal: total,
      efectivo: datos.efectivo,
      tarjeta: datos.tarjeta,
      credito: datos.credito,
      saldo: datos.credito,
      pagoCon: datos.efectivo + datos.tarjeta + datos.credito,
      vuelto: datos.vuelto,
      lineas: carrito.map((l) => ({
        idProducto: l.producto.id,
        descripcion: l.producto.descripcion ?? '',
        codigo: l.producto.codigo ?? undefined,
        cantidad: l.cantidad,
        precioUnitario: l.precioUnitario,
        costo: l.producto.precioCompra ?? 0,
        usaInventarios: l.producto.usaInventarios ?? 'NO',
      })),
    };
    try {
      await window.posAPI.ventas.registrar(venta);
    } catch (e) {
      setError((e as Error).message);
      return;
    }

    if (datos.modo === 'directo') {
      try {
        const cfg = ((await obtenerTicket().catch(() => ({}))) ?? {}) as Record<string, string>;
        const txt = (k: string, def: string): string =>
          typeof cfg[k] === 'string' && cfg[k].trim() ? cfg[k] : def;
        const esFactura = cfg.formato === 'FACTURA' || datos.tipoDoc === 'FACTURA';
        await window.posAPI.impresora.imprimirTicket('192.168.1.100', 9100, {
          empresa: empresaNombre,
          identificadorFiscal: txt('identificadorFiscal', DISENO_DEFAULT.identificadorFiscal),
          direccion: txt('direccion', DISENO_DEFAULT.direccion),
          provinciaDepartamentoPais: txt('provinciaDepartamentoPais', DISENO_DEFAULT.provinciaDepartamentoPais),
          numeroDoc: docActual,
          cajero: usuario?.nombres ?? usuario?.login ?? '',
          cliente:
            clientes.find((c) => c.idCliente === datos.idCliente)?.nombre ?? 'GENERICO',
          fecha: new Date().toLocaleString(),
          lineas: carrito.map((l) => ({
            descripcion: l.producto.descripcion ?? '',
            cantidad: l.cantidad,
            precio: l.precioUnitario,
          })),
          subtotal: total,
          descuento: 0,
          total,
          son: numeroALetras(total),
          nombreDeMoneda: txt('nombreDeMoneda', DISENO_DEFAULT.nombreDeMoneda),
          efectivo: datos.efectivo,
          vuelto: datos.vuelto,
          tipoPago,
          numProductos: carrito.reduce((s, l) => s + l.cantidad, 0),
          agradecimiento: txt('agradecimiento', DISENO_DEFAULT.agradecimiento),
          paginaWebFacebook: txt('paginaWebFacebook', DISENO_DEFAULT.paginaWebFacebook),
          anuncio: txt('anuncio', DISENO_DEFAULT.anuncio),
          datosFiscales: txt('datosFiscales', DISENO_DEFAULT.datosFiscales),
          esFactura,
        });
      } catch {
        /* impresora opcional */
      }
      setMostrarCobro(false);
      setMsg(`Venta ${docActual} cobrada.`);
    } else {
      // Guardar y ver en pantalla: mostramos la vista del ticket.
      const nombreCli =
        clientes.find((c) => c.idCliente === datos.idCliente)?.nombre ?? 'GENERICO';
      setTicketData({
        empresa: empresaNombre,
        numeroDoc: docActual,
        cajero: usuario?.nombres ?? usuario?.login ?? '',
        cliente: nombreCli,
        fecha: new Date().toLocaleString(),
        subtotal: total,
        descuento: 0,
        total,
        efectivo: datos.efectivo,
        vuelto: datos.vuelto,
        tipoPago,
        numProductos: carrito.reduce((s, l) => s + l.cantidad, 0),
        lineas: carrito.map((l) => ({
          descripcion: l.producto.descripcion ?? '',
          cantidad: l.cantidad,
          precio: l.precioUnitario,
        })),
      });
      setMostrarCobro(false);
    }
    setCarrito([]);
    setSel(null);
    buscarRef.current?.focus();
  }

  // Atajos de teclado F1 (lectora), F2 (teclado), F3 (cobrar).
  useEffect(() => {
    function onKey(e: KeyboardEvent): void {
      if (mostrarCobro || ticketData) return; // el modal maneja sus atajos
      if (e.key === 'F1') {
        e.preventDefault();
        setModo('lectora');
      } else if (e.key === 'F2') {
        e.preventDefault();
        setModo('teclado');
      } else if (e.key === 'F3') {
        e.preventDefault();
        cobrar();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [cobrar, mostrarCobro, ticketData]);

  const credito = (): void => setMsg('Gestión de créditos: próximamente.');

  return (
    <div className={cn('flex min-h-full flex-col bg-background text-foreground', oscuro && 'dark')}>
      {/* Barra superior */}
      <header className="flex flex-wrap items-center gap-3 border-b bg-card px-4 py-2">
        <div className="flex items-center gap-2 text-lg font-bold">
          <Monitor className="size-5 text-primary" /> PSE
        </div>
        <div className="relative min-w-[16rem] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={buscarRef}
            className="pl-9"
            placeholder={
              modo === 'teclado'
                ? 'Buscar con TECLADO (nombre o código)'
                : 'Buscar con LECTORA de Codigos de Barras'
            }
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            onKeyDown={onBuscarKey}
          />
          {sugerencias.length > 0 && (
            <ul className="absolute z-20 mt-1 max-h-72 w-full overflow-auto rounded-md border bg-popover p-1 shadow-md">
              {sugerencias.map((p) => (
                <li
                  key={p.id}
                  className="flex cursor-pointer items-center justify-between gap-3 rounded-sm px-3 py-2 text-sm hover:bg-accent"
                  onClick={() => { agregar(p); setBusqueda(''); buscarRef.current?.focus(); }}
                >
                  <span>{p.descripcion}</span>
                  <span className="text-muted-foreground">{p.codigo} · {precioDe(p).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex gap-1">
          <Button variant={modo === 'lectora' ? 'default' : 'outline'} size="sm" onClick={() => setModo('lectora')}>
            <Camera /> Lectora (F1)
          </Button>
          <Button variant={modo === 'teclado' ? 'default' : 'outline'} size="sm" onClick={() => setModo('teclado')}>
            <Keyboard /> Teclado (F2)
          </Button>
        </div>
        <div className="text-sm font-medium">👑 {usuario?.nombres ?? usuario?.login ?? 'Usuario'}</div>
      </header>

      {/* Acciones rápidas */}
      <div className="flex flex-wrap gap-2 border-b bg-muted/40 px-4 py-2">
        <Button variant="outline" size="sm" onClick={() => onIr?.('cobros')}><CreditCard /> Cobros</Button>
        <Button variant="outline" size="sm" onClick={credito}><Users /> Aperturar Credito por Cobrar</Button>
        <Button variant="outline" size="sm" onClick={credito}>Aperturar Credito por Pagar</Button>
        <Button variant={mayoreo ? 'default' : 'outline'} size="sm" onClick={toggleMayoreo}>🪙 Mayoreo</Button>
        <Button variant="outline" size="sm" onClick={() => onIr?.('movimientos')}>↩ Ingreso dinero</Button>
        <Button variant="outline" size="sm" onClick={() => onIr?.('movimientos')}>↪ Salida dinero</Button>
      </div>

      <div className="flex flex-wrap gap-2 px-4 py-2">
        <Button variant="secondary" onClick={() => onIr?.('movimientos')}>Ver Ingresos y Salidas</Button>
        <Button onClick={() => onCerrarTurno?.()}>Cerrar Turno</Button>
        <Button onClick={() => onIr?.('compras')}>Comprar</Button>
      </div>

      <div className="flex flex-1 flex-wrap gap-4 px-4 pb-4">
        <section className="flex min-w-[20rem] flex-1 flex-col gap-3">
          <div className="rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8"></TableHead>
                  <TableHead className="w-8"></TableHead>
                  <TableHead className="w-8"></TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead className="text-right">Cant</TableHead>
                  <TableHead className="text-right">P_Unit</TableHead>
                  <TableHead className="text-right">Importe</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {carrito.map((l, i) => (
                  <TableRow
                    key={l.producto.id}
                    data-state={sel === i ? 'selected' : undefined}
                    className="cursor-pointer"
                    onClick={() => setSel(i)}
                  >
                    <TableCell>
                      <Button variant="ghost" size="icon" className="size-7 text-destructive" onClick={() => quitar(i)}>
                        <X />
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="size-7" onClick={() => cambiarCantidad(i, 1)}>
                        <Plus />
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="size-7" onClick={() => cambiarCantidad(i, -1)}>
                        <Minus />
                      </Button>
                    </TableCell>
                    <TableCell>{l.producto.descripcion}</TableCell>
                    <TableCell className="text-right tabular-nums">{l.cantidad.toFixed(2)}</TableCell>
                    <TableCell className="text-right tabular-nums">{l.precioUnitario.toFixed(2)}</TableCell>
                    <TableCell className="text-right tabular-nums">{(l.cantidad * l.precioUnitario).toFixed(2)}</TableCell>
                    <TableCell className="text-right tabular-nums">{l.producto.stock ?? '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {error && <Alert variant="error">{error}</Alert>}
          {msg && <Alert variant="success">{msg}</Alert>}
        </section>

        <aside className="flex w-72 flex-col gap-3">
          <div className="rounded-lg bg-primary/10 p-4 text-right text-3xl font-bold tabular-nums">{total.toFixed(2)}</div>
          <Input className="text-right text-lg tabular-nums" value={entrada} readOnly />
          <div className="grid grid-cols-4 gap-2">
            {['1', '2', '3'].map((d) => (<Button key={d} variant="outline" onClick={() => tecla(d)}>{d}</Button>))}
            <Button variant="secondary" onClick={() => aplicar('cantidad')}>CANT</Button>
            {['4', '5', '6'].map((d) => (<Button key={d} variant="outline" onClick={() => tecla(d)}>{d}</Button>))}
            <Button variant="secondary" onClick={() => aplicar('precio')}>PREC</Button>
            {['7', '8', '9'].map((d) => (<Button key={d} variant="outline" onClick={() => tecla(d)}>{d}</Button>))}
            <Button variant="secondary" onClick={() => setEntrada('')}>Borrar</Button>
            <Button variant="outline" onClick={() => tecla('0')}>0</Button>
            <Button variant="outline" onClick={() => tecla(',')}>,</Button>
            <Button variant="outline" onClick={() => setEntrada((e) => e.slice(0, -1))}>⌫</Button>
          </div>
          <div className="rounded-lg bg-muted p-3 text-sm">
            <div className="flex justify-between"><span>Sub Total:</span><span className="tabular-nums">{subTotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>IVA (16%):</span><span className="tabular-nums">{iva.toFixed(2)}</span></div>
          </div>
          <Button size="lg" className="w-full" disabled={carrito.length === 0} onClick={() => void cobrar()}>
            <CreditCard /> Cobrar (F3)
          </Button>
        </aside>
      </div>

      {/* Barra inferior */}
      <footer className="flex flex-wrap items-center gap-2 border-t bg-card px-4 py-2">
        <Button variant="outline" size="sm" onClick={ponerEnEspera}>
          <Pause /> Poner en Espera{espera.length ? ` (${espera.length})` : ''}
        </Button>
        <Button variant="outline" size="sm" onClick={restaurar} disabled={espera.length === 0}>
          <Play /> Restaurar
        </Button>
        <Button variant="outline" size="sm" onClick={() => { setCarrito([]); setSel(null); }}>
          <Trash2 /> Eliminar
        </Button>
        <span className="ml-auto flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => onIr?.('reportes')}>∑ Ver ventas del día y Devoluciones</Button>
          <Button variant="outline" size="sm" onClick={() => setOscuro((o) => !o)}>
            {oscuro ? (<><Sun /> Tema Claro</>) : (<><Moon /> Tema Oscuro</>)}
          </Button>
        </span>
      </footer>

      {mostrarCobro && (
        <CobroModal
          total={total}
          numeroDoc={docActual}
          clientes={clientes}
          onCancelar={() => setMostrarCobro(false)}
          onConfirmar={(d) => void confirmarCobro(d)}
        />
      )}
      {ticketData && (
        <TicketPreview data={ticketData} onNueva={() => setTicketData(null)} />
      )}
    </div>
  );
}
