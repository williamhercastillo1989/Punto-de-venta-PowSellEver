import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { HealthController } from './health/health.controller';
import { ProductosModule } from './productos/productos.module';
import { VentasModule } from './ventas/ventas.module';
import { AuthModule } from './auth/auth.module';
import { CajaModule } from './caja/caja.module';
import { ProveedoresModule } from './proveedores/proveedores.module';
import { ComprasModule } from './compras/compras.module';
import { InventarioModule } from './inventario/inventario.module';
import { ReportesModule } from './reportes/reportes.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { EmpresaModule } from './empresa/empresa.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    CajaModule,
    ProductosModule,
    VentasModule,
    ProveedoresModule,
    ComprasModule,
    InventarioModule,
    ReportesModule,
    UsuariosModule,
    EmpresaModule,
    // Próximos módulos (mapeo 1:1 con las capas Logica/Datos del sistema viejo):
    // ClientesModule, ...
  ],
  controllers: [HealthController],
})
export class AppModule {}
