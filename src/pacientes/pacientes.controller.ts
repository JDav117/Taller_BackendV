import { Controller, Post, Get, Delete, Put, Param, Body, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { PacientesService } from './pacientes.service';
import { Paciente } from './Entity/paciente.entity';

@ApiTags('Pacientes')
@ApiBearerAuth()
@Controller('pacientes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PacientesController {
  constructor(private readonly pacientesService: PacientesService) {}

  @Post()
  @Roles('usuario')
  @ApiOperation({ summary: 'Crear un nuevo paciente' })
  @ApiBody({ type: Paciente })
  @ApiResponse({ status: 201, description: 'Paciente creado exitosamente.' })
  @ApiResponse({ status: 403, description: 'Solo puedes crear tu propio perfil.' })
  crear(@Body() paciente: Paciente, @Req() req) {
    // Solo permite crear paciente si el usuario es dueño
    if (paciente.id && paciente.id !== req.user.userId) {
      throw new ForbiddenException('Solo puedes crear tu propio perfil.');
    }
    return this.pacientesService.crearPaciente(paciente);
  }

  @Get()
  @Roles('usuario')
  @ApiOperation({ summary: 'Obtener el perfil del paciente autenticado' })
  @ApiResponse({ status: 200, description: 'Perfil del paciente.' })
  obtenerTodos(@Req() req) {
    // Solo retorna el paciente autenticado
    return this.pacientesService.obtenerPorId(req.user.userId);
  }

  @Put(':id')
  @Roles('usuario')
  @ApiOperation({ summary: 'Actualizar el perfil del paciente autenticado' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: Paciente })
  @ApiResponse({ status: 200, description: 'Perfil actualizado.' })
  @ApiResponse({ status: 403, description: 'Solo puedes modificar tu propio perfil.' })
  actualizar(@Param('id') id: string, @Body() paciente: Paciente, @Req() req) {
    if (Number(id) !== req.user.userId) {
      throw new ForbiddenException('Solo puedes modificar tu propio perfil.');
    }
    return this.pacientesService.actualizarPaciente(Number(id), paciente);
  }

  @Delete(':id')
  @Roles('usuario')
  @ApiOperation({ summary: 'Eliminar el perfil del paciente autenticado' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Perfil eliminado.' })
  @ApiResponse({ status: 403, description: 'Solo puedes eliminar tu propio perfil.' })
  eliminar(@Param('id') id: string, @Req() req) {
    if (Number(id) !== req.user.userId) {
      throw new ForbiddenException('Solo puedes eliminar tu propio perfil.');
    }
    return this.pacientesService.eliminarPaciente(Number(id));
  }
}
