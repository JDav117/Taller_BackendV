import { Controller, Put, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { MedicosService } from './medicos.service';
import { Medico } from './Entity/medico.entity';

@Controller('medicos')
export class MedicosController {
  constructor(private readonly medicosService: MedicosService) {}


  @Post()
  crear(@Body() medico: Medico) {
    return this.medicosService.crearMedico(medico);
  }

  @Get()
  obtenerTodos() {
    return this.medicosService.obtenerTodos();
  }

  @Delete(':id')
  eliminar(@Param('id') id: number) {
    return this.medicosService.eliminarMedico(Number(id));
  }

  @Put(':id')
  actualizar(@Param('id') id: number, @Body() medicoData: Medico) {
    return this.medicosService.actualizar(id, medicoData);
  }

  @Get(':id')
  obtenerPorId(@Param('id') id: number) {
    return this.medicosService.obtenerPorId(Number(id));
  }
}
