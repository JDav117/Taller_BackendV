import { Controller, Get, Post, Delete, Put, Body, Param, UseGuards, Req, ForbiddenException } from '@nestjs/common';
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
  @ApiResponse({ status: 403, description: 'Solo puedes crear tus propias citas.' })
  crear(@Body() cita: Cita, @Req() req) {
    if (cita.usuarioId !== req.user.userId) {
      throw new ForbiddenException('Solo puedes crear tus propias citas.');
    }
    return this.citasService.crearCita(cita);
  }

  @Get()
  @Roles('usuario')
  @ApiOperation({ summary: 'Obtener todas las citas del usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Listado de citas del usuario.' })
  obtenerTodas(@Req() req) {
    return this.citasService.obtenerTodasPorUsuario(req.user.userId);
  }

  @Put(':id')
  @Roles('usuario')
  @ApiOperation({ summary: 'Actualizar una cita médica por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: Cita })
  @ApiResponse({ status: 200, description: 'Cita actualizada.' })
  actualizar(@Param('id') id: number, @Body() cita: Cita, @Req() req) {
    return this.citasService.actualizarCitaUsuario(Number(id), cita, req.user.userId);
  }

  @Delete(':id')
  @Roles('usuario')
  @ApiOperation({ summary: 'Eliminar una cita médica por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Cita eliminada.' })
  eliminar(@Param('id') id: number, @Req() req) {
    return this.citasService.eliminarCitaUsuario(Number(id), req.user.userId);
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
    return cita;
  }
}
