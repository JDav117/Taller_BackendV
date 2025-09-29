import { Controller, Put, Get, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { MedicosService } from './medicos.service';
import { Medico } from './Entity/medico.entity';

@ApiTags('Medicos')
@ApiBearerAuth()
@Controller('medicos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MedicosController {
  constructor(private readonly medicosService: MedicosService) {}

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Crear un nuevo médico' })
  @ApiBody({ type: Medico })
  @ApiResponse({ status: 201, description: 'Médico creado exitosamente.' })
  crear(@Body() medico: Medico) {
    return this.medicosService.crearMedico(medico);
  }

  @Get()
  @Roles('admin')
  @ApiOperation({ summary: 'Obtener todos los médicos' })
  @ApiResponse({ status: 200, description: 'Listado de médicos.' })
  obtenerTodos() {
    return this.medicosService.obtenerTodos();
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Eliminar un médico por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Médico eliminado.' })
  @ApiResponse({ status: 404, description: 'Médico no encontrado.' })
  eliminar(@Param('id') id: number) {
    return this.medicosService.eliminarMedico(Number(id));
  }

  @Put(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Actualizar un médico por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: Medico })
  @ApiResponse({ status: 200, description: 'Médico actualizado.' })
  @ApiResponse({ status: 404, description: 'Médico no encontrado.' })
  actualizar(@Param('id') id: number, @Body() medicoData: Medico) {
    return this.medicosService.actualizar(id, medicoData);
  }

  @Get(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Obtener un médico por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Médico encontrado.' })
  @ApiResponse({ status: 404, description: 'Médico no encontrado.' })
  obtenerPorId(@Param('id') id: number) {
    return this.medicosService.obtenerPorId(Number(id));
  }
}
