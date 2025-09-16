import { Injectable } from '@nestjs/common';
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

   async eliminarPaciente(id: number): Promise<boolean> {
    const result = await this.pacienteRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}