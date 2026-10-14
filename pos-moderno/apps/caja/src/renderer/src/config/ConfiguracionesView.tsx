import { Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Item {
  k: string;
  label: string;
  icon: string;
}
interface Grupo {
  titulo: string;
  items: Item[];
}

const GRUPOS: Grupo[] = [
  {
    titulo: 'Generales',
    items: [
      { k: 'empresa', label: 'Empresa', icon: '🏪' },
      { k: 'usuarios', label: 'Usuarios', icon: '👥' },
      { k: 'cajas', label: 'Cajas', icon: '🧾' },
      { k: 'serializacion', label: 'Serializacion', icon: '🔢' },
      { k: 'productos', label: 'Productos', icon: '🧃' },
      { k: 'clientes', label: 'Clientes', icon: '❤️' },
      { k: 'proveedores', label: 'Proveedores', icon: '🧑‍💼' },
    ],
  },
  {
    titulo: 'Personalizacion',
    items: [{ k: 'comprobantes', label: 'Diseño de Comprobantes', icon: '🧾' }],
  },
  {
    titulo: 'Dispositivos',
    items: [
      { k: 'impresoras', label: 'Impresoras', icon: '🖨️' },
      { k: 'balanza', label: 'Balanza', icon: '⚖️' },
    ],
  },
  {
    titulo: 'Notificaciones',
    items: [{ k: 'correo', label: 'Notificaciones por Correo Electronico', icon: '✉️' }],
  },
  {
    titulo: 'Terminales',
    items: [{ k: 'terminalmp', label: 'Mercado Pago', icon: '💳' }],
  },
  {
    titulo: 'Mantenimiento',
    items: [{ k: 'respaldo', label: 'Respaldo de Base de datos', icon: '🗄️' }],
  },
];

export function ConfiguracionesView({
  onAbrir,
  onVolver,
}: {
  onAbrir: (k: string) => void;
  onVolver: () => void;
}): JSX.Element {
  return (
    <div className="p-4">
      <div className="mb-4">
        <Button variant="outline" onClick={onVolver}>
          <Crown /> Volver al Administrador
        </Button>
      </div>
      <div className="flex flex-col gap-6">
        {GRUPOS.map((g) => (
          <Card key={g.titulo}>
            <CardHeader>
              <CardTitle className="text-base">{g.titulo}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {g.items.map((it) => (
                  <button
                    key={it.k}
                    className="flex flex-col items-center justify-center gap-2 rounded-lg border bg-card p-4 text-center transition-colors hover:border-primary hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    onClick={() => onAbrir(it.k)}
                  >
                    <span className="text-3xl leading-none">{it.icon}</span>
                    <span className="text-sm font-medium">{it.label}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
