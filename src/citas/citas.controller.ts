import { Controller, Get, Post, Delete, Put, Body, Param, UseGuards, Req, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CitasService } from './citas.service';
import { CreateCitaDto } from './dto/create-cita.dto';

@ApiTags('Citas')
@ApiBearerAuth()
@Controller('citas')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CitasController {
  constructor(private readonly citasService: CitasService) { }

  @Post()
  @Roles('usuario')
  @ApiOperation({ summary: 'Crear una nueva cita médica' })
  @ApiBody({ type: CreateCitaDto })
  @ApiResponse({ status: 201, description: 'Cita creada exitosamente.' })
  async crear(@Body() dto: CreateCitaDto, @Req() req) {
    // El usuarioId se toma del JWT, no del body
    const nuevaCita = await this.citasService.crearCita(dto, req.user.sub);
    return { message: 'Cita creada exitosamente.', cita: nuevaCita };
  }

  @Get()
  @Roles('usuario')
  @ApiOperation({ summary: 'Obtener todas las citas del usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Listado de citas del usuario.' })
  async obtenerTodas(@Req() req) {
    const citas = await this.citasService.obtenerTodasPorUsuario(req.user.sub);
    return { message: 'Citas obtenidas correctamente.', citas };
  }

  @Put(':id')
  @Roles('usuario')
  @ApiOperation({ summary: 'Actualizar una cita médica por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: CreateCitaDto })
  @ApiResponse({ status: 200, description: 'Cita actualizada.' })
  async actualizar(@Param('id') id: number, @Body() dto: CreateCitaDto, @Req() req) {
    const citaActualizada = await this.citasService.actualizarCitaUsuario(Number(id), dto, req.user.sub);
    return { message: 'Cita actualizada correctamente.', cita: citaActualizada };
  }

  @Delete(':id')
  @Roles('usuario')
  @ApiOperation({ summary: 'Eliminar una cita médica por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Cita eliminada.' })
  async eliminar(@Param('id') id: number, @Req() req) {
    const eliminada = await this.citasService.eliminarCitaUsuario(Number(id), req.user.sub);
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
    if (cita.usuarioId !== req.user.sub) {
      throw new ForbiddenException('No tienes permiso para ver esta cita.');
    }
    return { message: 'Cita obtenida correctamente.', cita };
  }
}
