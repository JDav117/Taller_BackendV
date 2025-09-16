import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Cita {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fecha_hora: Date;

  @Column()
  motivo: string;

  @Column()
  pacienteId: number;

  @Column()
  medicoId: number;
}