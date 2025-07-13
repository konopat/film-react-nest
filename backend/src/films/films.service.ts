import { Injectable } from '@nestjs/common';
import { FilmsResponseDto, ScheduleResponseDto } from './dto/films.dto';
import { FilmsRepository } from '../repository/films.repository';

@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async getFilms(): Promise<FilmsResponseDto> {
    return this.filmsRepository.findAll();
  }

  async getFilmSchedule(id: string): Promise<ScheduleResponseDto> {
    return this.filmsRepository.findScheduleByFilmId(id);
  }
}
