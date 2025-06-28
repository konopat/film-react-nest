import { Injectable } from '@nestjs/common';
import {
  FilmsResponseDto,
  ScheduleResponseDto,
  FilmDto,
  SessionDto,
} from './dto/films.dto';

@Injectable()
export class FilmsService {
  getFilms(): FilmsResponseDto {
    // Пустышка с примерными данными
    const mockFilm: FilmDto = {
      id: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
      rating: 2.9,
      director: 'Итан Райт',
      tags: ['Документальный'],
      title: 'Архитекторы общества',
      about:
        'Документальный фильм, исследующий влияние искусственного интеллекта на общество и этические, философские и социальные последствия технологии.',
      description:
        'Документальный фильм Итана Райта исследует влияние технологий на современное общество, уделяя особое внимание роли искусственного интеллекта в формировании нашего будущего. Фильм исследует этические, философские и социальные последствия гонки технологий ИИ и поднимает вопрос: какой мир мы создаём для будущих поколений.',
      image: '/images/bg1s.jpg',
      cover: '/images/bg1c.jpg',
    };

    return {
      total: 81692856.64964156,
      items: [mockFilm, mockFilm], // Дублируем для примера
    };
  }

  getFilmSchedule(id: string): ScheduleResponseDto {
    // Пустышка с примерными данными
    const mockSession: SessionDto = {
      id: '95ab4a20-9555-4a06-bfac-184b8c53fe70',
      daytime: '2023-05-29T10:30:00.001Z',
      hall: '2',
      rows: 5,
      seats: 10,
      price: 350,
      taken: ['1:2', '1:2'],
    };

    return {
      total: 50985752.9195197,
      items: [mockSession, mockSession], // Дублируем для примера
    };
  }
}
