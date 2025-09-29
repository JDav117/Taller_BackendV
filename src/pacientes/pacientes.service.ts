import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Paciente } from './Entity/paciente.entity';

@Injectable()
export class PacientesService {
  constructor(
    @InjectRepository(Paciente)
    private readonly pacienteRepository: Repository<Paciente>,
  ) {}

  /**
   * Crea un nuevo paciente en el sistema.
   */
  async crearPaciente(paciente: Paciente): Promise<Paciente> {
    return await this.pacienteRepository.save(paciente);
  }

  /**
   * Obtiene todos los pacientes registrados.
   */
  async obtenerTodos(): Promise<Paciente[]> {
    return await this.pacienteRepository.find();
  }

  /**
   * Actualiza los datos de un paciente existente.
   */
  async actualizarPaciente(id: number, pacienteData: Paciente): Promise<Paciente> {
    const paciente = await this.pacienteRepository.findOneBy({ id });
    if (!paciente) {
      throw new NotFoundException(`Paciente no encontrado`);
    }
    // Validar existencia de email único (opcional, si lo usas como login)
    // const existeEmail = await this.pacienteRepository.findOneBy({ email: pacienteData.email });
    // if (existeEmail && existeEmail.id !== id) {
    //   throw new BadRequestException('El email ya está registrado para otro paciente.');
    // }
    paciente.nombre = pacienteData.nombre;
    paciente.apellido = pacienteData.apellido;
    paciente.fechaNacimiento = pacienteData.fechaNacimiento;
    paciente.email = pacienteData.email;
    return await this.pacienteRepository.save(paciente);
  }

  /**
   * Elimina un paciente por su ID si existe.
   */
  async eliminarPaciente(id: number): Promise<string> {
    const paciente = await this.pacienteRepository.findOneBy({ id });
    if (!paciente) {
      throw new NotFoundException(`Paciente con id ${id} no encontrado`);
    }
    const result = await this.pacienteRepository.delete(id);
    return `Paciente con id ${id} eliminado correctamente.`;
  }

  /**
   * Obtiene un paciente por su ID.
   */
  async obtenerPorId(id: number): Promise<Paciente> {
    const paciente = await this.pacienteRepository.findOneBy({ id });
    if (!paciente) {
      throw new NotFoundException(`Paciente con id ${id} no encontrado`);
    }
    return paciente;
  }
}