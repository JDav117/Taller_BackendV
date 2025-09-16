import { Controller, Put, Get, Param, Body } from '@nestjs/common';
import { MedicosService } from './medicos.service';
import { Medico } from './Entity/medico.entity';

@Controller('medicos')
export class MedicosController {
  constructor(private readonly medicosService: MedicosService) {}

  @Put(':id')
  actualizar(@Param('id') id: number, @Body() medicoData: Medico) {
    return this.medicosService.actualizar(id, medicoData);
  }

  @Get(':id')
  obtenerPorId(@Param('id') id: number) {
    return this.medicosService.obtenerPorId(Number(id));
  }
}
