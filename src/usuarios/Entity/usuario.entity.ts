import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum RolUsuario {
  ADMIN = 'admin',
  USUARIO = 'usuario',
}

@Entity('usuario')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  // Deja solo esta restricción única
  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  // Usa enum en MySQL con valor por defecto
  @Column({ type: 'enum', enum: RolUsuario, default: RolUsuario.USUARIO })
  rol: RolUsuario;
}
