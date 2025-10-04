import { Controller, Post, Body, UseGuards, Get, Put, Delete, Param, Req, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { LoginUsuarioDto } from './dto/login-usuario.dto';
import { Usuario } from './Entity/usuario.entity';

@ApiTags('Usuarios')
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  // Registro público
  @Post('register')
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiBody({ type: CreateUsuarioDto })
  @ApiResponse({ status: 201, description: 'Usuario registrado exitosamente.' })
  async register(@Body() dto: CreateUsuarioDto) {
    const usuario = await this.usuariosService.register(dto);
    return { message: 'Usuario registrado exitosamente.', usuario };
  }

  // Login público
  @Post('login')
  @ApiOperation({ summary: 'Login de usuario' })
  @ApiBody({ type: LoginUsuarioDto })
  @ApiResponse({ status: 200, description: 'Login exitoso, retorna JWT.' })
  async login(@Body() dto: LoginUsuarioDto) {
    return this.usuariosService.login(dto);
  }

  // Rutas protegidas con JWT y roles
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  @Roles('usuario', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener el perfil del usuario autenticado' })
  async obtenerTodos(@Req() req) {
    if (req.user.rol === 'admin') {
      const usuarios = await this.usuariosService.obtenerTodos();
      return { message: 'Usuarios obtenidos correctamente.', usuarios };
    }
    const usuario = await this.usuariosService.obtenerPorId(req.user.sub);
    return { message: 'Usuario obtenido correctamente.', usuario };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id')
  @Roles('usuario', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar el perfil del usuario autenticado' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: CreateUsuarioDto })
  async actualizar(@Param('id') id: string, @Body() dto: CreateUsuarioDto, @Req() req) {
    if (Number(id) !== req.user.sub && req.user.rol !== 'admin') {
      throw new ForbiddenException('Solo puedes modificar tu propio perfil.');
    }
    const usuarioActualizado = await this.usuariosService.actualizarUsuario(Number(id), dto);
    return { message: 'Usuario actualizado correctamente.', usuario: usuarioActualizado };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  @Roles('usuario', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar el perfil del usuario autenticado' })
  @ApiParam({ name: 'id', type: String })
  async eliminar(@Param('id') id: string, @Req() req) {
    if (Number(id) !== req.user.sub && req.user.rol !== 'admin') {
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
