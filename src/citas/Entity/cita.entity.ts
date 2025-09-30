import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EstadoCita } from '../dto/create-cita.dto';

@Entity()
export class Cita {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fecha: string; // YYYY-MM-DD

  @Column()
  horaInicio: string; // HH:mm

  @Column()
  horaFin: string; // HH:mm

  @Column({ type: 'text' })
  motivo: string;

  @Column()
  usuarioId: number;

  @Column()
  medicoId: number;

  @Column({ type: 'enum', enum: EstadoCita, default: EstadoCita.PENDIENTE })
  estado: EstadoCita;
}