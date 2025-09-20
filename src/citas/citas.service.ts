import { Injectable } from '@nestjs/common';
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

  async eliminarCita(id: number): Promise<boolean> {
    const result = await this.citaRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async obtenerPorId(id: number): Promise<Cita | null> {
    return await this.citaRepository.findOneBy({ id });
  }
}
