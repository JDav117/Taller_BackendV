import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { CitasService } from './citas.service';
import { Cita } from './Entity/cita.entity';

@Controller('citas')
export class CitasController {
  constructor(private readonly citasService: CitasService) {}

  @Post()
  crear(@Body() cita: Cita) {
    return this.citasService.crearCita(cita);
  }

  @Get()
  obtenerTodas() {
    return this.citasService.obtenerTodas();
  }

  @Delete(':id')
  eliminar(@Param('id') id: number) {
    return this.citasService.eliminarCita(Number(id));
  }

  @Get(':id')
  obtenerPorId(@Param('id') id: number) {
    return this.citasService.obtenerPorId(Number(id));
  }
}
