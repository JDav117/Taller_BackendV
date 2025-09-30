import { Controller, Get, Post, Delete, Put, Body, Param, UseGuards, Req, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CitasService } from './citas.service';
import { Cita } from './Entity/cita.entity';

@ApiTags('Citas')
@ApiBearerAuth()
@Controller('citas')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CitasController {
  constructor(private readonly citasService: CitasService) {}

  @Post()
  @Roles('usuario')
  @ApiOperation({ summary: 'Crear una nueva cita médica' })
  @ApiBody({ type: Cita })
  @ApiResponse({ status: 201, description: 'Cita creada exitosamente.' })
  @ApiResponse({ status: 403, description: 'No tienes permisos para crear citas de otros usuarios.' })
  async crear(@Body() cita: Cita, @Req() req) {
    if (cita.usuarioId !== req.user.userId) {
      throw new ForbiddenException('No tienes permisos para crear citas de otros usuarios.');
    }
    const nuevaCita = await this.citasService.crearCita(cita);
    return { message: 'Cita creada exitosamente.', cita: nuevaCita };
  }

  @Get()
  @Roles('usuario')
  @ApiOperation({ summary: 'Obtener todas las citas del usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Listado de citas del usuario.' })
  async obtenerTodas(@Req() req) {
    const citas = await this.citasService.obtenerTodasPorUsuario(req.user.userId);
    return { message: 'Citas obtenidas correctamente.', citas };
  }

  @Put(':id')
  @Roles('usuario')
  @ApiOperation({ summary: 'Actualizar una cita médica por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: Cita })
  @ApiResponse({ status: 200, description: 'Cita actualizada.' })
  async actualizar(@Param('id') id: number, @Body() cita: Cita, @Req() req) {
    const citaActualizada = await this.citasService.actualizarCitaUsuario(Number(id), cita, req.user.userId);
    return { message: 'Cita actualizada correctamente.', cita: citaActualizada };
  }

  @Delete(':id')
  @Roles('usuario')
  @ApiOperation({ summary: 'Eliminar una cita médica por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Cita eliminada.' })
  async eliminar(@Param('id') id: number, @Req() req) {
    const eliminada = await this.citasService.eliminarCitaUsuario(Number(id), req.user.userId);
    if (eliminada) {
      return { message: 'Cita eliminada correctamente.' };
    } else {
      throw new NotFoundException('No se pudo eliminar la cita.');
    }
  }

  @Get(':id')
  @Roles('usuario')
  @ApiOperation({ summary: 'Obtener una cita médica por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Cita encontrada.' })
  @ApiResponse({ status: 403, description: 'No tienes permiso para ver esta cita.' })
  async obtenerPorId(@Param('id') id: number, @Req() req) {
    const cita = await this.citasService.obtenerPorId(Number(id));
    if (cita.usuarioId !== req.user.userId) {
      throw new ForbiddenException('No tienes permiso para ver esta cita.');
    }
    return { message: 'Cita obtenida correctamente.', cita };
  }
}
