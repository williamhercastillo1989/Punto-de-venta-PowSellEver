import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { RegistrarCompraDto } from './dto/registrar-compra.dto';

type Tx = Prisma.TransactionClient;

/**
 * Acceso a datos de Compras. Reutiliza los stored procedures existentes, todo en
 * una transacción (igual que ventas, pero sumando inventario en vez de restarlo):
 *
 *   insertar_Compras('COMPRA NUEVA', 1ª línea)  →  (SELECT MAX Idcompra)
 *     →  insertar_DetalleCompra (líneas restantes)
 *     →  insertar_KARDEX_Entrada + aumentarStock (por línea con inventario)
 *     →  confirmarCompra
 */
@Injectable()
export class ComprasRepository {
  constructor(private readonly prisma: PrismaService) {}

  private execSp(tx: Tx, proc: string, params: unknown[]): Promise<number> {
    const placeholders = params.map((_, i) => `@P${i + 1}`).join(', ');
    return tx.$executeRawUnsafe(`EXEC dbo.${proc} ${placeholders}`, ...params);
  }

  async registrarCompraCompleta(
    dto: RegistrarCompraDto,
  ): Promise<{ idCompra: number; total: number }> {
    const fecha = dto.fechaCompra ? new Date(dto.fechaCompra) : new Date();
    const [primera, ...resto] = dto.lineas;

    return this.prisma.$transaction(async (tx) => {
      // 1) Cabecera + 1ª línea de detalle (insertar_Compras lo hace en un paso).
      await this.execSp(tx, 'insertar_Compras', [
        dto.idCaja, // @Idcaja
        fecha, // @fechacompra
        'COMPRA NUEVA', // @Estado
        primera.cantidad, // @Cantidad
        primera.costo, // @Costo
        primera.moneda ?? '', // @Moneda
        primera.idProducto, // @IdProducto
        primera.descripcion, // @Descripcion
      ]);

      // 2) Id de la compra recién creada.
      const filas = await tx.$queryRawUnsafe<Array<{ idCompra: number }>>(
        `SELECT MAX(Idcompra) AS idCompra FROM Compras WHERE Idcaja = @P1`,
        dto.idCaja,
      );
      const idCompra = Number(filas[0]?.idCompra);
      if (!idCompra) {
        throw new Error('No se pudo obtener el id de la compra recién creada');
      }

      // 3) Líneas restantes de detalle.
      for (const l of resto) {
        await this.execSp(tx, 'insertar_DetalleCompra', [
          idCompra, // @IdCompra
          l.cantidad, // @Cantidad
          l.costo, // @Costo
          l.moneda ?? '', // @Moneda
          l.idProducto, // @IdProducto
          l.descripcion, // @Descripcion
        ]);
      }

      // 4) Kardex de entrada + aumento de stock por cada línea con inventario.
      let total = 0;
      for (const l of dto.lineas) {
        total += l.cantidad * l.costo;
        if ((l.usaInventarios ?? 'NO').toUpperCase() === 'SI') {
          await this.execSp(tx, 'insertar_KARDEX_Entrada', [
            fecha, // @Fecha
            'Compra', // @Motivo
            l.cantidad, // @Cantidad
            l.idProducto, // @Id_producto
            dto.idUsuario, // @Id_usuario
            'ENTRADA', // @Tipo
            'Activo', // @Estado
            dto.idCaja, // @Id_caja
          ]);
          await this.execSp(tx, 'aumentarStock', [l.idProducto, l.cantidad]);
        }
      }

      // 5) Confirmación: fija Total, genera Comprobante (Serie 'TC') y proveedor real.
      await this.execSp(tx, 'confirmarCompra', [
        idCompra, // @Idcompra
        total, // @Total
        dto.idCaja, // @Idcaja
        dto.idProveedor, // @Idproveedor
        fecha, // @fechacompra
      ]);

      return { idCompra, total };
    });
  }

  listar() {
    return this.prisma.compra.findMany({ orderBy: { idCompra: 'desc' } });
  }
}
