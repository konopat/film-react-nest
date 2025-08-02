import { Injectable, Inject } from '@nestjs/common';
import { FilmsResponseDto, ScheduleResponseDto } from './dto/films.dto';
import { IFilmsRepository } from '../repository/films-repository.interface';

@Injectable()
export class FilmsService {
  constructor(
    @Inject('IFilmsRepository')
    private readonly filmsRepository: IFilmsRepository,
  ) {}

  async getFilms(): Promise<FilmsResponseDto> {
    return this.filmsRepository.findAll();
  }

  async getFilmSchedule(id: string): Promise<ScheduleResponseDto> {
    return this.filmsRepository.findScheduleByFilmId(id);
  }
}
