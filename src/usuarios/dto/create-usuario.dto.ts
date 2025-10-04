import { IsString, IsNotEmpty, MinLength, MaxLength, IsEmail, IsIn, IsOptional } from 'class-validator';
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

  @ApiProperty({ example: 'miclaveSegura123', description: 'Contraseña del usuario (mínimo 8 caracteres).' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(100)
  password: string; 

  @ApiProperty({ example: 'usuario', description: 'Rol del usuario (admin o usuario).' })
  @IsString()
  @IsIn(['admin', 'usuario'])
  @IsOptional()
  rol?: 'admin' | 'usuario';
}
