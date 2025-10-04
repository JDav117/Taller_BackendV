import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './Entity/usuario.entity';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { JwtModule } from '@nestjs/jwt'; // <-- AGREGA ESTA LÍNEA

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'supersecreto',
      signOptions: { expiresIn: '8h' },
    }),
  ],
  providers: [UsuariosService],
  controllers: [UsuariosController],
  exports: [UsuariosService],
})
export class UsuariosModule {}