import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './Entity/usuario.entity';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async crearUsuario(usuario: Usuario): Promise<Usuario> {
    const existeEmail = await this.usuarioRepository.findOneBy({ email: usuario.email });
    if (existeEmail) {
      throw new BadRequestException('El email ya está registrado.');
    }
    return await this.usuarioRepository.save(usuario);
  }

  async obtenerTodos(): Promise<Usuario[]> {
    return await this.usuarioRepository.find();
  }

  async actualizarUsuario(id: number, usuarioData: Usuario): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOneBy({ id });
    if (!usuario) {
      throw new NotFoundException(`Usuario no encontrado`);
    }
    usuario.nombre = usuarioData.nombre;
    usuario.email = usuarioData.email;
    usuario.passwordHash = usuarioData.passwordHash;
    usuario.rol = usuarioData.rol;
    return await this.usuarioRepository.save(usuario);
  }

  async eliminarUsuario(id: number): Promise<string> {
    const usuario = await this.usuarioRepository.findOneBy({ id });
    if (!usuario) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
    await this.usuarioRepository.delete(id);
    return `Usuario con id ${id} eliminado correctamente.`;
  }

  async obtenerPorId(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOneBy({ id });
    if (!usuario) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
    return usuario;
  }
}
