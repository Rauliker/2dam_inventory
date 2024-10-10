import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { default as classroomData } from '../data/classroom';
import { UtilsService } from 'src/utils/utils.service';
import { Classroom } from './classroom.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ClassroomService {
  constructor(
    private readonly UtilsService: UtilsService,
    @InjectRepository(Classroom) private classroomRepository: Repository<Classroom>
  ) {}

  async getAllClassroom(xml?: string): Promise<Classroom[] | string> {
    if (xml === 'true') {
      const jsonForXml = JSON.stringify({ classroom_list: classroomData });
      const xmlResult = this.UtilsService.convertJSONtoXML(jsonForXml);
      return await xmlResult;
    } else {
      return classroomData;
    }
  }

  async createClassroom(Classroom: any): Promise<Classroom[]> {
    const newClassroom = this.classroomRepository.create(Classroom);
    return this.classroomRepository.save(newClassroom);
  }

  async getClassroom(id_classroom: number, xml: string): Promise<Classroom | string | null> {
    const classroom = classroomData.find((classroom) => classroom.id_classroom === id_classroom);
    if (classroom != null) {
      if (xml === 'true') {
        const jsonForXml = JSON.stringify(classroom);
        return await this.UtilsService.convertJSONtoXML(jsonForXml);
      } else {
        return classroom;
      }
    } else {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
  }

  async updateClassroom(ClassroomUpdated: any): Promise<Classroom> {
    const classroom = classroomData.find((classroom) => classroom.id_classroom === ClassroomUpdated.id_classroom);
    if (classroom) {
      Object.assign(classroom, ClassroomUpdated);
      return classroom;
    } else {
      throw new Error('Classroom no encontrado');
    }
  }

  async deleteClassroom(id_classroom: number): Promise<void> {
    const index = classroomData.findIndex((classroom) => classroom.id_classroom === id_classroom);
    if (index !== -1) {
      classroomData.splice(index, 1);
    } else {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
  }
}