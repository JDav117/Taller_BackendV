import { IsString, IsNotEmpty, MinLength, MaxLength, IsEmail, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUsuarioDto {
  @ApiProperty({ example: 'Ana Gómez', description: 'Nombre completo del usuario.' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  nombre: string;

  @ApiProperty({ example: 'ana.gomez@email.com', description: 'Correo electrónico único del usuario.' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'hashedpassword123', description: 'Hash de la contraseña del usuario.' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(100)
  passwordHash: string;

  @ApiProperty({ example: 'usuario', description: 'Rol del usuario (admin o usuario).' })
  @IsString()
  @IsIn(['admin', 'usuario'])
  rol: 'admin' | 'usuario';
}
