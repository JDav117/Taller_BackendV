import { Controller, Get, Param } from '@nestjs/common';
import { CitasService } from './citas.service';

@Controller('citas')
export class CitasController {
  constructor(private readonly citasService: CitasService) {}

  @Get(':id')
  obtenerPorId(@Param('id') id: number) {
    return this.citasService.obtenerPorId(Number(id));
  }
}
