import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cita } from './Entity/cita.entity';

@Injectable()
export class CitasService {
  constructor(
    @InjectRepository(Cita)
    private readonly citaRepository: Repository<Cita>,
  ) {}

  async crearCita(cita: Cita): Promise<Cita> {
    return await this.citaRepository.save(cita);
  }

  async obtenerTodas(): Promise<Cita[]> {
    return await this.citaRepository.find();
  }


  async actualizarCita(id: number, citaData: Cita): Promise<Cita> {
    const cita = await this.citaRepository.findOneBy({ id });
    if (!cita) {
      throw new NotFoundException(`Cita con id ${id} no encontrada`);
    }
    cita.fecha_hora = citaData.fecha_hora;
    cita.motivo = citaData.motivo;
    cita.pacienteId = citaData.pacienteId;
    cita.medicoId = citaData.medicoId;
    return await this.citaRepository.save(cita);
  }


  async eliminarCita(id: number): Promise<boolean> {
    const cita = await this.citaRepository.findOneBy({ id });
    if (!cita) {
      throw new NotFoundException(`Cita con id ${id} no encontrada`);
    }
    const result = await this.citaRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async obtenerPorId(id: number): Promise<Cita> {
    const cita = await this.citaRepository.findOneBy({ id });
    if (!cita) {
      throw new NotFoundException(`Cita con id ${id} no encontrada`);
    }
    return cita;
  }
}
