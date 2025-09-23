import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Medico } from './Entity/medico.entity';
@Injectable()
export class MedicosService {
  constructor(
    @InjectRepository(Medico)
    private readonly medicoRepository: Repository<Medico>,
  ) {}

  async crearMedico(medico: Medico): Promise<Medico> {
    return await this.medicoRepository.save(medico);
  }

  async obtenerTodos(): Promise<Medico[]> {
    return await this.medicoRepository.find();
  }

  async eliminarMedico(id: number): Promise<boolean> {
    const medico = await this.medicoRepository.findOneBy({ id });
    if (!medico) {
      throw new NotFoundException(`Medico con id ${id} no encontrado`);
    }
    const result = await this.medicoRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async actualizar(id: number, medicoData: Medico): Promise<Medico> {
    const medico = await this.medicoRepository.findOneBy({ id });
    if (!medico) {
      throw new NotFoundException(`Medico con id ${id} no encontrado`);
    }
    medico.nombre = medicoData.nombre;
    medico.apellido = medicoData.apellido;
    medico.especialidad = medicoData.especialidad;
    medico.email = medicoData.email;
    return await this.medicoRepository.save(medico);
  }

  async obtenerPorId(id: number): Promise<Medico> {
    const medico = await this.medicoRepository.findOneBy({ id });
    if (!medico) {
      throw new NotFoundException(`Medico con id ${id} no encontrado`);
    }
    return medico;
  }
}
