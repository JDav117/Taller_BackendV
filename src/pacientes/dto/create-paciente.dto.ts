import { IsString, IsNotEmpty, MinLength, MaxLength, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePacienteDto {
  @ApiProperty({ example: 'Ana Gómez', description: 'Nombre completo del paciente.' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  nombre: string;

  @ApiProperty({ example: 'ana.gomez@email.com', description: 'Correo electrónico único del paciente.' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'hashedpassword123', description: 'Hash de la contraseña del paciente.' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(100)
  passwordHash: string;
}
