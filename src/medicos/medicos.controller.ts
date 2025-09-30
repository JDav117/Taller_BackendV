import { Controller, Put, Get, Post, Delete, Param, Body, UseGuards, NotFoundException } from '@nestjs/common';
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
  async crear(@Body() medico: Medico) {
    const nuevoMedico = await this.medicosService.crearMedico(medico);
    return { message: 'Médico creado exitosamente.', medico: nuevoMedico };
  }

  @Get()
  @Roles('admin')
  @ApiOperation({ summary: 'Obtener todos los médicos' })
  @ApiResponse({ status: 200, description: 'Listado de médicos.' })
  async obtenerTodos() {
    const medicos = await this.medicosService.obtenerTodos();
    return { message: 'Médicos obtenidos correctamente.', medicos };
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Eliminar un médico por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Médico eliminado.' })
  @ApiResponse({ status: 404, description: 'Médico no encontrado.' })
  async eliminar(@Param('id') id: number) {
    const eliminado = await this.medicosService.eliminarMedico(Number(id));
    if (eliminado) {
      return { message: 'Médico eliminado correctamente.' };
    } else {
      throw new NotFoundException('No se pudo eliminar el médico.');
    }
  }

  @Put(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Actualizar un médico por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: Medico })
  @ApiResponse({ status: 200, description: 'Médico actualizado.' })
  @ApiResponse({ status: 404, description: 'Médico no encontrado.' })
  async actualizar(@Param('id') id: number, @Body() medicoData: Medico) {
    const medicoActualizado = await this.medicosService.actualizar(id, medicoData);
    return { message: 'Médico actualizado correctamente.', medico: medicoActualizado };
  }

  @Get(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Obtener un médico por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Médico encontrado.' })
  @ApiResponse({ status: 404, description: 'Médico no encontrado.' })
  async obtenerPorId(@Param('id') id: number) {
    const medico = await this.medicosService.obtenerPorId(Number(id));
    if (medico) {
      return { message: 'Médico obtenido correctamente.', medico };
    } else {
      throw new NotFoundException('Médico no encontrado.');
    }
  }
}
