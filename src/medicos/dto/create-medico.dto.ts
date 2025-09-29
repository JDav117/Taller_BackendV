import { IsString, IsNotEmpty, MinLength, MaxLength, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum EstadoMedico {
  ACTIVO = 'ACTIVO',
  INACTIVO = 'INACTIVO',
}

export class CreateMedicoDto {
  @ApiProperty({ example: 'Juan Pérez', description: 'Nombre completo del médico.' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  nombre: string;

  @ApiProperty({ example: 'Cardiología', description: 'Especialidad médica.' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  especialidad: string;

  @ApiProperty({ enum: EstadoMedico, example: EstadoMedico.ACTIVO, description: 'Estado del médico (ACTIVO/INACTIVO).' })
  @IsEnum(EstadoMedico)
  @IsNotEmpty()
  estado: EstadoMedico;
}
