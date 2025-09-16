import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Paciente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  apellido: string;

  @Column()
  fechaNacimiento: Date;

  @Column()
  email: string;
}