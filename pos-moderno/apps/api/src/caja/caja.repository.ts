import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AperturaCajaDto, CierreCajaDto } from './dto/caja.dto';

interface TurnoRow {
  Id_caja: number;
  fechainicio: Date | null;
  SaldoInicial: number | null;
}

/**
 * Acceso a datos del ciclo de caja (tabla MOVIMIENTOCAJACIERRE).
 * Reutiliza los SPs existentes:
 *   insertar_DETALLE_cierre_de_caja  → apertura de turno (Estado 'CAJA APERTURADA')
 *   mostrar_cierre_de_caja_pendiente → turno abierto
 *   cerrarCaja                       → cierre de turno (Estado 'CAJA CERRADA')
 */
@Injectable()
export class CajaRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** Abre el turno. El SP lanza error si ya hay una caja aperturada. */
  abrir(dto: AperturaCajaDto): Promise<number> {
    const ahora = new Date();
    return this.prisma.$executeRawUnsafe(
      `EXEC dbo.insertar_DETALLE_cierre_de_caja @P1,@P2,@P3,@P4,@P5,@P6,@P7,@P8,@P9,@P10,@P11,@P12`,
      ahora, // @fechaini
      ahora, // @fechafin (provisional)
      ahora, // @fechacierre (provisional)
      0, // @ingresos
      0, // @egresos
      dto.saldoInicial, // @saldo (inicial)
      dto.idUsuario, // @idusuario
      0, // @totalcaluclado
      0, // @totalreal
      'CAJA APERTURADA', // @estado
      0, // @diferencia
      dto.idCaja, // @id_caja
    );
  }

  async turnoAbierto(idCaja: number): Promise<TurnoRow | null> {
    const filas = await this.prisma.$queryRawUnsafe<TurnoRow[]>(
      'EXEC dbo.mostrar_cierre_de_caja_pendiente @P1',
      idCaja,
    );
    return filas[0] ?? null;
  }

  cerrar(dto: CierreCajaDto): Promise<number> {
    const ahora = new Date();
    return this.prisma.$executeRawUnsafe(
      `EXEC dbo.cerrarCaja @P1,@P2,@P3,@P4,@P5,@P6,@P7,@P8,@P9,@P10,@P11`,
      ahora, // @fechafin
      ahora, // @fechacierre
      dto.ingresos, // @ingresos
      dto.egresos, // @egresos
      dto.saldoQuedaEnCaja, // @Saldo_queda_en_caja
      dto.idUsuario, // @Id_usuario
      dto.totalCalculado, // @Total_calculado
      dto.totalReal, // @Total_real
      'CAJA CERRADA', // @Estado
      dto.diferencia, // @Diferencia
      dto.idCaja, // @Id_caja
    );
  }
}
