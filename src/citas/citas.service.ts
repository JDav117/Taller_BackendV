import { Injectable } from '@nestjs/common';
import { Cita } from './Entity/cita.entity';

@Injectable()
export class CitasService {
  private citas: Cita[] = [];
  private idCounter = 1;

  obtenerPorId(id: number): Cita | null {
    return this.citas.find(c => c.id === id) || null;
  }
}
