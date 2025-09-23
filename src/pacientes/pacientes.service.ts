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

  async crearPaciente(paciente: Paciente): Promise<Paciente> {
    return await this.pacienteRepository.save(paciente);
  }

  async obtenerTodos(): Promise<Paciente[]> {
    return await this.pacienteRepository.find();
  }

  async actualizarPaciente(id: number, pacienteData: Paciente): Promise<Paciente> {
    const paciente = await this.pacienteRepository.findOneBy({ id });
    if (!paciente) {
      throw new NotFoundException(`Paciente con id ${id} no encontrado`);
    }
    paciente.nombre = pacienteData.nombre;
    paciente.apellido = pacienteData.apellido;
    paciente.fechaNacimiento = pacienteData.fechaNacimiento;
    paciente.email = pacienteData.email;
    return await this.pacienteRepository.save(paciente);
  }

  async eliminarPaciente(id: number): Promise<boolean> {
    const paciente = await this.pacienteRepository.findOneBy({ id });
    if (!paciente) {
      throw new NotFoundException(`Paciente con id ${id} no encontrado`);
    }
    const result = await this.pacienteRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async obtenerPorId(id: number): Promise<Paciente> {
    const paciente = await this.pacienteRepository.findOneBy({ id });
    if (!paciente) {
      throw new NotFoundException(`Paciente con id ${id} no encontrado`);
    }
    return paciente;
  }
}