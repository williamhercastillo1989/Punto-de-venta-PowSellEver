import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/** Fila cruda que devuelve el SP validar_usuario (SELECT * FROM USUARIO2). */
interface UsuarioRow {
  idUsuario: number;
  Nombres_y_Apellidos: string | null;
  Login: string | null;
  Rol: string | null;
  Correo: string | null;
  Estado: string | null;
}

/**
 * Acceso a datos de autenticación. Reutiliza el SP `validar_usuario`.
 *
 * NOTA: en la BD actual la contraseña está en TEXTO PLANO (USUARIO2.Password).
 * Esto se mantiene para no romper los datos existentes; en la migración de datos
 * se deben hashear (bcrypt) y cambiar la comparación.
 */
@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async validarUsuario(
    login: string,
    password: string,
  ): Promise<UsuarioRow | null> {
    const filas = await this.prisma.$queryRawUnsafe<UsuarioRow[]>(
      'EXEC dbo.validar_usuario @P1, @P2',
      password,
      login,
    );
    return filas[0] ?? null;
  }
}
