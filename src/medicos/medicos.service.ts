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

  /**
   * Crea un nuevo médico en el sistema.
   */
  async crearMedico(medico: Medico): Promise<Medico> {
    return await this.medicoRepository.save(medico);
  }

  /**
   * Obtiene todos los médicos registrados.
   */
  async obtenerTodos(): Promise<Medico[]> {
    return await this.medicoRepository.find();
  }

  /**
   * Elimina un médico por su ID si existe.
   */
  async eliminarMedico(id: number): Promise<boolean> {
    const medico = await this.medicoRepository.findOneBy({ id });
    if (!medico) {
      throw new NotFoundException(`Medico con id ${id} no encontrado`);
    }
    const result = await this.medicoRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  /**
   * Actualiza los datos de un médico existente.
   */
  async actualizar(id: number, medicoData: Medico): Promise<Medico> {
    const medico = await this.medicoRepository.findOneBy({ id });
    if (!medico) {
      throw new NotFoundException(`Medico con id ${id} no encontrado`);
    }
    // Validar existencia de email único (opcional, si lo usas como login)
    // const existeEmail = await this.medicoRepository.findOneBy({ email: medicoData.email });
    // if (existeEmail && existeEmail.id !== id) {
    //   throw new BadRequestException('El email ya está registrado para otro médico.');
    // }
    medico.nombre = medicoData.nombre;
    medico.apellido = medicoData.apellido;
    medico.especialidad = medicoData.especialidad;
    medico.email = medicoData.email;
    return await this.medicoRepository.save(medico);
  }

  /**
   * Obtiene un médico por su ID.
   */
  async obtenerPorId(id: number): Promise<Medico> {
    const medico = await this.medicoRepository.findOneBy({ id });
    if (!medico) {
      throw new NotFoundException(`Medico con id ${id} no encontrado`);
    }
    return medico;
  }
}
