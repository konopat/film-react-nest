import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Film } from '../entities/film.entity';
import { Schedule } from '../entities/schedule.entity';
import { FilmDto, SessionDto } from '../films/dto/films.dto';
import { IFilmsRepository } from './films-repository.interface';

@Injectable()
export class TypeOrmFilmsRepository implements IFilmsRepository {
  constructor(
    @InjectRepository(Film)
    private filmRepository: Repository<Film>,
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
  ) {}

  async findAll(): Promise<{ total: number; items: FilmDto[] }> {
    const films = await this.filmRepository.find();
    return {
      total: films.length,
      items: films.map((film) => this.mapToFilmDto(film)),
    };
  }

  async findScheduleByFilmId(
    filmId: string,
  ): Promise<{ total: number; items: SessionDto[] }> {
    const schedules = await this.scheduleRepository.find({
      where: { filmId },
    });

    return {
      total: schedules.length,
      items: schedules.map((schedule) => this.mapToSessionDto(schedule)),
    };
  }

  async findSessionById(sessionId: string): Promise<SessionDto | null> {
    const schedule = await this.scheduleRepository.findOne({
      where: { id: sessionId },
    });

    return schedule ? this.mapToSessionDto(schedule) : null;
  }

  async updateSessionTaken(
    sessionId: string,
    taken: string[],
  ): Promise<boolean> {
    const result = await this.scheduleRepository.update(
      { id: sessionId },
      { taken },
    );

    return result.affected ? result.affected > 0 : false;
  }

  private mapToFilmDto(film: Film): FilmDto {
    return {
      id: film.id,
      rating: Number(film.rating),
      director: film.director,
      tags: film.tags,
      title: film.title,
      about: film.about,
      description: film.description,
      image: film.image,
      cover: film.cover,
    };
  }

  private mapToSessionDto(schedule: Schedule): SessionDto {
    return {
      id: schedule.id,
      daytime: schedule.daytime,
      hall: schedule.hall,
      rows: schedule.rows,
      seats: schedule.seats,
      price: Number(schedule.price),
      taken: schedule.taken,
    };
  }
}
