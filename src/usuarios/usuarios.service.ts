import { Injectable, NotFoundException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario, RolUsuario } from './Entity/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { LoginUsuarioDto } from './dto/login-usuario.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: CreateUsuarioDto): Promise<Omit<Usuario, 'passwordHash'>> {
    const existeEmail = await this.usuarioRepository.findOneBy({ email: dto.email });
    if (existeEmail) {
      throw new ConflictException('El email ya está registrado.');
    }
    const passwordHash = await bcrypt.hash(dto.password, 10);
    // Forzar rol usuario en registro público
    const usuario = this.usuarioRepository.create({
      nombre: dto.nombre,
      email: dto.email,
      passwordHash,
      rol: RolUsuario.USUARIO,
    });
    const saved = await this.usuarioRepository.save(usuario);
    // No exponer passwordHash
    const { passwordHash: _, ...rest } = saved;
    return rest;
  }

  async login(dto: LoginUsuarioDto): Promise<{ access_token: string }> {
    const usuario = await this.usuarioRepository.findOne({
      where: { email: dto.email },
      select: ['id', 'email', 'passwordHash', 'rol'],
    });
    if (!usuario) throw new UnauthorizedException('Credenciales inválidas');
    const match = await bcrypt.compare(dto.password, usuario.passwordHash);
    if (!match) throw new UnauthorizedException('Credenciales inválidas');
    const payload = { sub: usuario.id, rol: usuario.rol };
    return { access_token: this.jwtService.sign(payload) };
  }

  async obtenerTodos(): Promise<Omit<Usuario, 'passwordHash'>[]> {
    const usuarios = await this.usuarioRepository.find();
    // No exponer passwordHash
    return usuarios.map(({ passwordHash, ...rest }) => rest);
  }

  async actualizarUsuario(id: number, usuarioData: Partial<CreateUsuarioDto>): Promise<Omit<Usuario, 'passwordHash'>> {
    const usuario = await this.usuarioRepository.findOneBy({ id });
    if (!usuario) {
      throw new NotFoundException(`Usuario no encontrado`);
    }
    // Verifica email único si cambia
    if (usuarioData.email && usuarioData.email !== usuario.email) {
      const existe = await this.usuarioRepository.findOneBy({ email: usuarioData.email });
      if (existe) throw new ConflictException('El email ya está en uso.');
      usuario.email = usuarioData.email;
    }
    usuario.nombre = usuarioData.nombre ?? usuario.nombre;
    if (usuarioData.password) {
      usuario.passwordHash = await bcrypt.hash(usuarioData.password, 10);
    }
    // Solo admin debería poder cambiar rol (esto se valida en el controlador)
    if (usuarioData.rol) {
    usuario.rol = (usuarioData.rol as RolUsuario) ?? usuario.rol;
    }
    const saved = await this.usuarioRepository.save(usuario);
    const { passwordHash, ...rest } = saved;
    return rest;
  }

  async eliminarUsuario(id: number): Promise<{ message: string }> {
    const usuario = await this.usuarioRepository.findOneBy({ id });
    if (!usuario) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
    await this.usuarioRepository.delete(id);
    return { message: `Usuario con id ${id} eliminado correctamente.` };
  }

  async obtenerPorId(id: number): Promise<Omit<Usuario, 'passwordHash'>> {
    const usuario = await this.usuarioRepository.findOneBy({ id });
    if (!usuario) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
    const { passwordHash, ...rest } = usuario;
    return rest;
  }
}