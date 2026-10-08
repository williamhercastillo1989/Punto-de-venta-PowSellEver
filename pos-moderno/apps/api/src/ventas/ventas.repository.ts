import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { RegistrarVentaDto } from './dto/registrar-venta.dto';

type Tx = Prisma.TransactionClient;

/**
 * Acceso a datos de Ventas. Reutiliza los stored procedures EXISTENTES del
 * sistema viejo (estrategia de migración: no reescribir los 178 SPs de golpe):
 *
 *   insertar_venta  →  (obtener id)  →  insertar_detalle_venta (x línea)
 *                   →  insertar_KARDEX_SALIDA + disminuir_stock (si usa inventario)
 *                   →  Confirmar_venta
 *
 * Todo dentro de una única transacción: o se registra la venta completa, o nada.
 */
@Injectable()
export class VentasRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** Ejecuta un SP por nombre con parámetros posicionales (@P1, @P2, ...). */
  private execSp(tx: Tx, proc: string, params: unknown[]): Promise<number> {
    const placeholders = params.map((_, i) => `@P${i + 1}`).join(', ');
    return tx.$executeRawUnsafe(`EXEC dbo.${proc} ${placeholders}`, ...params);
  }

  async registrarVentaCompleta(
    dto: RegistrarVentaDto,
  ): Promise<{ idVenta: number; numeroDeDoc: string }> {
    const fechaVenta = dto.fechaVenta ? new Date(dto.fechaVenta) : new Date();
    const comprobante = dto.comprobante ?? 'TICKET';
    const fechaPago = fechaVenta.toISOString().slice(0, 10);

    return this.prisma.$transaction(async (tx) => {
      // Resolver cliente: si no se envía, usar el cliente GENERICO (ventas al público).
      let idCliente = dto.idCliente;
      if (!idCliente) {
        const cli = await tx.$queryRawUnsafe<Array<{ idclientev: number }>>(
          `SELECT TOP 1 idclientev FROM clientes WHERE Nombre = 'GENERICO' ORDER BY idclientev`,
        );
        idCliente = cli[0]?.idclientev;
        if (!idCliente) {
          throw new Error(
            'No hay cliente GENERICO configurado para ventas al público',
          );
        }
      }

      // 1) Cabecera (borrador) SIN número final: Confirmar_venta lo asigna y valida.
      await this.execSp(tx, 'insertar_venta', [
        idCliente, // @idcliente
        fechaVenta, // @fecha_venta
        '', // @nume_documento (se asigna en Confirmar_venta)
        dto.montoTotal, // @montototal
        dto.tipoPago, // @Tipo_de_pago
        'EN PROCESO', // @estado
        dto.igv ?? 0, // @IGV
        comprobante, // @Comprobante
        dto.idUsuario, // @id_usuario
        fechaPago, // @Fecha_de_pago
        'VENTA', // @ACCION
        dto.saldo ?? 0, // @Saldo
        dto.pagoCon ?? 0, // @Pago_con
        dto.porcentajeIgv ?? 0, // @Porcentaje_IGV
        dto.idCaja, // @Id_caja
        dto.referenciaTarjeta ?? '', // @Referencia_tarjeta
      ]);

      // 2) Id de la venta recién creada (dentro de la misma transacción).
      const filas = await tx.$queryRawUnsafe<Array<{ idVenta: number }>>(
        `SELECT MAX(idventa) AS idVenta FROM ventas WHERE Id_caja = @P1`,
        dto.idCaja,
      );
      const idVenta = Number(filas[0]?.idVenta);
      if (!idVenta) {
        throw new Error('No se pudo obtener el id de la venta recién creada');
      }

      // 3) Detalle + movimientos de inventario por cada línea.
      for (const l of dto.lineas) {
        await this.execSp(tx, 'insertar_detalle_venta', [
          idVenta, // @idventa
          l.idProducto, // @Id_presentacionfraccionada
          l.cantidad, // @cantidad
          l.precioUnitario, // @preciounitario
          l.moneda ?? '', // @moneda
          l.unidadDeMedida ?? '', // @unidades
          l.cantidad, // @Cantidad_mostrada
          'Activo', // @Estado
          l.descripcion, // @Descripcion
          l.codigo ?? '', // @Codigo
          '', // @Stock
          l.seVendeA ?? '', // @Se_vende_a
          l.usaInventarios ?? 'NO', // @Usa_inventarios
          l.costo ?? 0, // @Costo
        ]);

        if ((l.usaInventarios ?? 'NO').toUpperCase() === 'SI') {
          await this.execSp(tx, 'insertar_KARDEX_SALIDA', [
            fechaVenta, // @Fecha
            `Venta ${dto.numeroDeDoc}`, // @Motivo
            l.cantidad, // @Cantidad
            l.idProducto, // @Id_producto
            dto.idUsuario, // @Id_usuario
            'SALIDA', // @Tipo
            'Activo', // @Estado
            dto.idCaja, // @Id_caja
          ]);
          await this.execSp(tx, 'disminuir_stock', [l.idProducto, l.cantidad]);
        }
      }

      // 4) Confirmación final. Confirmar_venta espera 18 parámetros.
      await this.execSp(tx, 'Confirmar_venta', [
        idVenta, // @idventa
        dto.montoTotal, // @montototal
        dto.igv ?? 0, // @IGV
        dto.saldo ?? 0, // @Saldo
        dto.tipoPago, // @Tipo_de_pago
        'PAGADO', // @Estado
        comprobante, // @Comprobante
        dto.numeroDeDoc, // @Numero_de_doc
        fechaVenta, // @fecha_venta
        'VENTA', // @ACCION
        fechaPago, // @Fecha_de_pago
        idCliente, // @idcliente
        dto.pagoCon ?? 0, // @Pago_con
        dto.referenciaTarjeta ?? '', // @Referencia_tarjeta
        dto.vuelto ?? 0, // @Vuelto
        dto.efectivo ?? 0, // @Efectivo
        dto.credito ?? 0, // @Credito
        dto.tarjeta ?? 0, // @Tarjeta
      ]);

      return { idVenta, numeroDeDoc: dto.numeroDeDoc };
    });
  }
}
