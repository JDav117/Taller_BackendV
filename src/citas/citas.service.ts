import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Cita } from './Entity/cita.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Medico } from '../medicos/Entity/medico.entity';
import { Paciente } from '../pacientes/Entity/paciente.entity';

@Injectable()
export class CitasService {
  constructor(
    @InjectRepository(Cita)
    private readonly citaRepository: Repository<Cita>,
  ) {}

  /**
   * Crea una nueva cita médica validando reglas de negocio:
   * - Duración mínima de 30 minutos
   * - Médico debe estar activo
   * - No debe solaparse con otra cita
   * - Usuario (paciente) debe existir
   */
  async crearCita(cita: Cita): Promise<Cita> {
    // Validar existencia de usuarioId
    const pacienteRepo = this.citaRepository.manager.getRepository(Paciente);
    const paciente = await pacienteRepo.findOneBy({ id: cita.usuarioId });
    if (!paciente) {
      throw new NotFoundException('El usuario (paciente) no existe.');
    }
    // Validar horario mínimo 30 minutos
    const horaInicio = cita['horaInicio'] || (cita as any).horaInicio;
    const horaFin = cita['horaFin'] || (cita as any).horaFin;
    if (horaInicio && horaFin) {
      const [hIni, mIni] = horaInicio.split(':').map(Number);
      const [hFin, mFin] = horaFin.split(':').map(Number);
      const ini = hIni * 60 + mIni;
      const fin = hFin * 60 + mFin;
      if (fin - ini < 30) {
        throw new BadRequestException('La cita debe durar al menos 30 minutos.');
      }
    }

    // Validar médico activo
    const medicoRepo = this.citaRepository.manager.getRepository(Medico);
    const medico = await medicoRepo.findOneBy({ id: cita.medicoId });
    if (!medico) {
      throw new NotFoundException('El médico no existe.');
    }
    if (medico.estado !== 'ACTIVO') {
      throw new BadRequestException('Solo se pueden agendar citas con médicos activos.');
    }

    // Validar solapamiento de citas
    const citasSolapadas = await this.citaRepository.createQueryBuilder('cita')
      .where('cita.medicoId = :medicoId', { medicoId: cita.medicoId })
      .andWhere('cita.fecha_hora = :fecha', { fecha: cita.fecha_hora })
      .andWhere('((:horaInicio BETWEEN cita.horaInicio AND cita.horaFin) OR (:horaFin BETWEEN cita.horaInicio AND cita.horaFin))', {
        horaInicio,
        horaFin,
      })
      .getMany();
    if (citasSolapadas.length > 0) {
      throw new ConflictException('Ya existe una cita en ese horario para el médico seleccionado.');
    }

    // Estado inicial de la cita
    (cita as any).estado = 'PENDIENTE';

    return await this.citaRepository.save(cita);
  }

  /**
   * Obtiene todas las citas médicas registradas en el sistema.
   */
  async obtenerTodas(): Promise<Cita[]> {
    return await this.citaRepository.find();
  }


  /**
   * Actualiza los datos de una cita médica validando existencia de usuario y médico.
   */
  /**
   * Actualiza los datos de una cita médica existente, validando reglas de negocio y existencia de usuario y médico.
   */
  async actualizarCita(id: number, citaData: Cita): Promise<Cita> {
    const cita = await this.citaRepository.findOneBy({ id });
    if (!cita) {
      throw new NotFoundException(`Cita con id ${id} no encontrada`);
    }
    // Validar existencia de usuarioId
    const pacienteRepo = this.citaRepository.manager.getRepository(Paciente);
    const paciente = await pacienteRepo.findOneBy({ id: citaData.usuarioId });
    if (!paciente) {
      throw new NotFoundException('El usuario (paciente) no existe.');
    }
    cita.fecha_hora = citaData.fecha_hora;
    cita.motivo = citaData.motivo;
    cita.pacienteId = citaData.pacienteId;
    cita.medicoId = citaData.medicoId;
    return await this.citaRepository.save(cita);
  }


  /**
   * Elimina una cita médica si cumple la política de cancelación:
   * - Solo se puede cancelar hasta 1 hora antes de la cita
   */
  /**
   * Elimina una cita médica por su ID si cumple con la política de cancelación (solo hasta 1 hora antes).
   */
  async eliminarCita(id: number): Promise<boolean> {
    const cita = await this.citaRepository.findOneBy({ id });
    if (!cita) {
      throw new NotFoundException(`Cita con id ${id} no encontrada`);
    }
    // Política: solo cancelar hasta 1 hora antes
    const ahora = new Date();
    const fechaCita = new Date(cita.fecha_hora);
    const minutosRestantes = (fechaCita.getTime() - ahora.getTime()) / (1000 * 60);
    if (minutosRestantes < 60) {
      throw new ConflictException('Solo se puede cancelar la cita hasta 1 hora antes de la hora agendada.');
    }
    const result = await this.citaRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  /**
   * Obtiene una cita médica por su ID.
   */
  async obtenerPorId(id: number): Promise<Cita> {
    const cita = await this.citaRepository.findOneBy({ id });
    if (!cita) {
      throw new NotFoundException(`Cita con id ${id} no encontrada`);
    }
    return cita;
  }
  async obtenerTodasPorUsuario(usuarioId: number): Promise<Cita[]> {
    return await this.citaRepository.find({ where: { usuarioId } });
  }

  async actualizarCitaUsuario(id: number, citaData: Cita, usuarioId: number): Promise<Cita> {
    const cita = await this.citaRepository.findOneBy({ id, usuarioId });
    if (!cita) {
      throw new NotFoundException('No tienes permiso para modificar esta cita o no existe.');
    }
    cita.fecha_hora = citaData.fecha_hora;
    cita.motivo = citaData.motivo;
    cita.medicoId = citaData.medicoId;
    return await this.citaRepository.save(cita);
  }

  async eliminarCitaUsuario(id: number, usuarioId: number): Promise<boolean> {
    const cita = await this.citaRepository.findOneBy({ id, usuarioId });
    if (!cita) {
      throw new NotFoundException('No tienes permiso para eliminar esta cita o no existe.');
    }
    // Política: solo cancelar hasta 1 hora antes
    const ahora = new Date();
    const fechaCita = new Date(cita.fecha_hora);
    const minutosRestantes = (fechaCita.getTime() - ahora.getTime()) / (1000 * 60);
    if (minutosRestantes < 60) {
      throw new ConflictException('Solo se puede cancelar la cita hasta 1 hora antes de la hora agendada.');
    }
    const result = await this.citaRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
