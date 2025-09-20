import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicosController } from './medicos.controller';
import { MedicosService } from './medicos.service';
import { Medico } from './Entity/medico.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Medico])],
  controllers: [MedicosController],
  providers: [MedicosService]
})
export class MedicosModule {}
