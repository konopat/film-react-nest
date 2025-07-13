import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Film } from './film.schema';
import { FilmDto, SessionDto } from '../films/dto/films.dto';

@Injectable()
export class FilmsRepository {
  constructor(@InjectModel(Film.name) private filmModel: Model<Film>) {}

  async findAll(): Promise<{ total: number; items: FilmDto[] }> {
    const films = await this.filmModel.find().exec();
    return {
      total: films.length,
      items: films.map((film) => this.mapToFilmDto(film)),
    };
  }

  async findScheduleByFilmId(
    filmId: string,
  ): Promise<{ total: number; items: SessionDto[] }> {
    const film = await this.filmModel.findOne({ id: filmId }).exec();
    if (!film) {
      return { total: 0, items: [] };
    }

    return {
      total: film.schedule.length,
      items: film.schedule.map((session) => this.mapToSessionDto(session)),
    };
  }

  async findSessionById(sessionId: string): Promise<SessionDto | null> {
    const film = await this.filmModel
      .findOne({ 'schedule.id': sessionId })
      .exec();
    if (!film) {
      return null;
    }

    const session = film.schedule.find((s) => s.id === sessionId);
    return session ? this.mapToSessionDto(session) : null;
  }

  async updateSessionTaken(
    sessionId: string,
    taken: string[],
  ): Promise<boolean> {
    const result = await this.filmModel
      .updateOne(
        { 'schedule.id': sessionId },
        { $set: { 'schedule.$.taken': taken } },
      )
      .exec();

    return result.modifiedCount > 0;
  }

  private mapToFilmDto(film: Film): FilmDto {
    return {
      id: film.id,
      rating: film.rating,
      director: film.director,
      tags: film.tags,
      title: film.title,
      about: film.about,
      description: film.description,
      image: film.image,
      cover: film.cover,
    };
  }

  private mapToSessionDto(session: {
    id: string;
    daytime: string;
    hall: number;
    rows: number;
    seats: number;
    price: number;
    taken: string[];
  }): SessionDto {
    return {
      id: session.id,
      daytime: session.daytime,
      hall: Number(session.hall),
      rows: session.rows,
      seats: session.seats,
      price: session.price,
      taken: session.taken,
    };
  }
}
