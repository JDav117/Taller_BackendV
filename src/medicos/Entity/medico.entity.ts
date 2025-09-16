import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Medico {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  apellido: string;

  @Column()
  especialidad: string;

  @Column()
  email: string;
}
