import { IsInt, IsDateString, IsString, IsNotEmpty, MinLength, MaxLength, IsEnum, IsOptional, Min, ValidateIf } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum EstadoCita {
  PENDIENTE = 'PENDIENTE',
  CONFIRMADA = 'CONFIRMADA',
  CANCELADA = 'CANCELADA',
}

export class CreateCitaDto {
  @ApiProperty({ example: 1, description: 'ID del médico asignado a la cita.' })
  @IsInt()
  @IsNotEmpty()
  medicoId: number;

  @ApiProperty({ example: '2025-10-01', description: 'Fecha de la cita en formato YYYY-MM-DD.' })
  @IsDateString()
  @IsNotEmpty()
  fecha: string; // YYYY-MM-DD

  @ApiProperty({ example: '09:00', description: 'Hora de inicio de la cita (HH:mm).' })
  @IsString()
  @MinLength(5)
  @MaxLength(5)
  @IsNotEmpty()
  horaInicio: string; // HH:mm

  @ApiProperty({ example: '09:30', description: 'Hora de fin de la cita (HH:mm).' })
  @IsString()
  @MinLength(5)
  @MaxLength(5)
  @IsNotEmpty()
  horaFin: string; // HH:mm

  @ApiPropertyOptional({ example: 'Consulta general', description: 'Motivo de la cita.' })
  @IsString()
  @IsOptional()
  motivo?: string;

  @ApiProperty({ example: 2, description: 'ID del usuario que agenda la cita.' })
  @IsInt()
  @IsNotEmpty()
  usuarioId: number;

  @ApiPropertyOptional({ enum: EstadoCita, description: 'Estado de la cita.' })
  @IsEnum(EstadoCita)
  @IsOptional()
  estado?: EstadoCita;
}
