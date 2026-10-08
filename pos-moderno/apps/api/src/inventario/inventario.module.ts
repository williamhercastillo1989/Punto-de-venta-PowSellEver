import {
  Body,
  Controller,
  Get,
  Injectable,
  Module,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { AjusteInventarioDto, TipoMov } from './ajuste.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

type Tx = Prisma.TransactionClient;

/**
 * Inventario / Kardex.
 *  - Lecturas: consultas Prisma limpias (evitan el cross join a EMPRESA + Logo de los SPs).
 *  - Ajuste manual de stock: reutiliza los SPs de kardex + stock en una transacción.
 */
@Injectable()
export class InventarioRepository {
  constructor(private readonly prisma: PrismaService) {}

  private execSp(tx: Tx, proc: string, params: unknown[]): Promise<number> {
    const placeholders = params.map((_, i) => `@P${i + 1}`).join(', ');
    return tx.$executeRawUnsafe(`EXEC dbo.${proc} ${placeholders}`, ...params);
  }

  inventario(filtro: string) {
    return this.prisma.$queryRawUnsafe(
      `SELECT Id_Producto1 AS idProducto, Codigo AS codigo, Descripcion AS descripcion,
              Precio_de_compra AS costo, Precio_de_venta AS precioVenta,
              TRY_CAST(Stock AS numeric(18,2)) AS stock, Stock_minimo AS stockMinimo,
              TRY_CAST(Precio_de_compra * TRY_CAST(Stock AS numeric(18,2)) AS numeric(18,2)) AS importe
         FROM Producto1
        WHERE Usa_inventarios = 'SI'
          AND (Descripcion + ISNULL(Codigo,'')) LIKE '%' + @P1 + '%'
        ORDER BY Descripcion`,
      filtro,
    );
  }

  bajoMinimo() {
    return this.prisma.$queryRawUnsafe(
      `SELECT Id_Producto1 AS idProducto, Codigo AS codigo, Descripcion AS descripcion,
              Precio_de_compra AS costo, Precio_de_venta AS precioVenta,
              TRY_CAST(Stock AS numeric(18,2)) AS stock, Stock_minimo AS stockMinimo
         FROM Producto1
        WHERE Usa_inventarios = 'SI'
          AND TRY_CAST(Stock AS numeric(18,2)) <= Stock_minimo
        ORDER BY Descripcion`,
    );
  }

  movimientos(idProducto: number) {
    return this.prisma.$queryRawUnsafe(
      `SELECT TOP 200 k.Id_kardex AS idKardex, k.Fecha AS fecha, p.Descripcion AS descripcion,
              k.Motivo AS motivo, k.Tipo AS tipo, k.Cantidad AS cantidad, k.Hay AS hay,
              k.Costo_unt AS costoUnt, u.Nombres_y_Apellidos AS cajero
         FROM KARDEX k
         INNER JOIN Producto1 p ON p.Id_Producto1 = k.Id_producto
         LEFT JOIN USUARIO2 u ON u.idUsuario = k.Id_usuario
        WHERE k.Id_producto = @P1
        ORDER BY k.Id_kardex DESC`,
      idProducto,
    );
  }

  async ajustar(dto: AjusteInventarioDto) {
    const fecha = new Date();
    return this.prisma.$transaction(async (tx) => {
      if (dto.tipo === TipoMov.Entrada) {
        await this.execSp(tx, 'insertar_KARDEX_Entrada', [
          fecha,
          dto.motivo,
          dto.cantidad,
          dto.idProducto,
          dto.idUsuario,
          'ENTRADA',
          'Activo',
          dto.idCaja,
        ]);
        await this.execSp(tx, 'aumentarStock', [dto.idProducto, dto.cantidad]);
      } else {
        await this.execSp(tx, 'insertar_KARDEX_SALIDA', [
          fecha,
          dto.motivo,
          dto.cantidad,
          dto.idProducto,
          dto.idUsuario,
          'SALIDA',
          'Activo',
          dto.idCaja,
        ]);
        await this.execSp(tx, 'disminuir_stock', [dto.idProducto, dto.cantidad]);
      }
      return { ajustado: true, idProducto: dto.idProducto, tipo: dto.tipo };
    });
  }
}

@Controller('inventario')
export class InventarioController {
  constructor(private readonly repo: InventarioRepository) {}

  @Get()
  inventario(@Query('q') q?: string) {
    return this.repo.inventario(q ?? '');
  }

  @Get('bajo-minimo')
  bajoMinimo() {
    return this.repo.bajoMinimo();
  }

  @Get(':idProducto/kardex')
  movimientos(@Param('idProducto', ParseIntPipe) idProducto: number) {
    return this.repo.movimientos(idProducto);
  }

  @Post('ajuste')
  ajustar(@Body() dto: AjusteInventarioDto) {
    return this.repo.ajustar(dto);
  }
}

@Module({
  controllers: [InventarioController],
  providers: [InventarioRepository],
})
export class InventarioModule {}
