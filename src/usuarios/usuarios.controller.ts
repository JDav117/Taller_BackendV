import { Controller, Post, Get, Delete, Put, Param, Body, UseGuards, Req, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UsuariosService } from './usuarios.service';
import { Usuario } from './Entity/usuario.entity';

@ApiTags('Usuarios')
@ApiBearerAuth()
@Controller('usuarios')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  @Roles('usuario', 'admin')
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiBody({ type: Usuario })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente.' })
  @ApiResponse({ status: 403, description: 'Solo puedes crear tu propio perfil.' })
  async crear(@Body() usuario: Usuario, @Req() req) {
    if (usuario.id && usuario.id !== req.user.userId && req.user.rol !== 'admin') {
      throw new ForbiddenException('Solo puedes crear tu propio perfil.');
    }
    const nuevoUsuario = await this.usuariosService.crearUsuario(usuario);
    return { message: 'Usuario creado exitosamente.', usuario: nuevoUsuario };
  }

  @Get()
  @Roles('usuario', 'admin')
  @ApiOperation({ summary: 'Obtener el perfil del usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Perfil del usuario.' })
  async obtenerTodos(@Req() req) {
    if (req.user.rol === 'admin') {
      const usuarios = await this.usuariosService.obtenerTodos();
      return { message: 'Usuarios obtenidos correctamente.', usuarios };
    }
    const usuario = await this.usuariosService.obtenerPorId(req.user.userId);
    return { message: 'Usuario obtenido correctamente.', usuario };
  }

  @Put(':id')
  @Roles('usuario', 'admin')
  @ApiOperation({ summary: 'Actualizar el perfil del usuario autenticado' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: Usuario })
  @ApiResponse({ status: 200, description: 'Perfil actualizado.' })
  @ApiResponse({ status: 403, description: 'Solo puedes modificar tu propio perfil.' })
  async actualizar(@Param('id') id: string, @Body() usuario: Usuario, @Req() req) {
    if (Number(id) !== req.user.userId && req.user.rol !== 'admin') {
      throw new ForbiddenException('Solo puedes modificar tu propio perfil.');
    }
    const usuarioActualizado = await this.usuariosService.actualizarUsuario(Number(id), usuario);
    return { message: 'Usuario actualizado correctamente.', usuario: usuarioActualizado };
  }

  @Delete(':id')
  @Roles('usuario', 'admin')
  @ApiOperation({ summary: 'Eliminar el perfil del usuario autenticado' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Perfil eliminado.' })
  @ApiResponse({ status: 403, description: 'Solo puedes eliminar tu propio perfil.' })
  async eliminar(@Param('id') id: string, @Req() req) {
    if (Number(id) !== req.user.userId && req.user.rol !== 'admin') {
      throw new ForbiddenException('Solo puedes eliminar tu propio perfil.');
    }
    const eliminado = await this.usuariosService.eliminarUsuario(Number(id));
    if (eliminado) {
      return { message: 'Usuario eliminado correctamente.' };
    } else {
      throw new NotFoundException('No se pudo eliminar el usuario.');
    }
  }
}
