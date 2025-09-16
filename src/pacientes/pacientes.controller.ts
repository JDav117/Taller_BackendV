import { Controller,Post, Get, Delete, Param, Body} from '@nestjs/common';
import { PacientesService } from './pacientes.service';
import { Paciente } from './Entity/paciente.entity';

@Controller('pacientes')
export class PacientesController {
  constructor(private readonly pacientesService: PacientesService) {}

  @Post()
  crear(@Body() paciente: Paciente) {
    return this.pacientesService.crearPaciente(paciente);
  }

  @Get()
  obtenerTodos() {
    return this.pacientesService.obtenerTodos();
  }

  @Delete(':id')
eliminar(@Param('id') id: string) {
  return this.pacientesService.eliminarPaciente(Number(id));
}
}
