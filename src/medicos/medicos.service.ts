import { Injectable } from '@nestjs/common';
import { Medico } from './Entity/medico.entity';

@Injectable()
export class MedicosService {
  private medicos: Medico[] = [];
  private idCounter = 1;

  actualizar(id: number, medicoData: Medico): Medico | null {
    const medico = this.medicos.find(m => m.id === id);
    if (!medico) {
      return null;
    }
    medico.nombre = medicoData.nombre;
    medico.especialidad = medicoData.especialidad;
    medico.email = medicoData.email;
    return medico;
  }

  obtenerPorId(id: number): Medico | null {
    return this.medicos.find(m => m.id === id) || null;
  }

/*  crearMedico(medico: Medico) {
    medico.id = this.idCounter++;
    this.medicos.push(medico);
    return medico;
  }

  obtenerTodos(): Medico[] {
    return this.medicos;
  }

  eliminarMedico(id: number): boolean {
    const index = this.medicos.findIndex(m => m.id === id);
    if (index === -1) {
      return false;
    }
    this.medicos.splice(index, 1);
    return true;
  }*/
}
