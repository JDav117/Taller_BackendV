import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PacientesModule } from './pacientes/pacientes.module';
import { MedicosModule } from './medicos/medicos.module';
import { CitasModule } from './citas/citas.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',      // usuario de MySQL
      password: '',   // contraseña de MySQL
      database: 'gestion_citas',   // nombre de base de datos
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // busca todas las entidades
      synchronize: true,           // Solo para desarrollo
    }),
    PacientesModule,
    MedicosModule,
    CitasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}