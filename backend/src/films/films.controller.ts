import { Controller, Get, Param } from '@nestjs/common';
import { FilmsService } from './films.service';
import { FilmsResponseDto, ScheduleResponseDto } from './dto/films.dto';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  async getFilms(): Promise<FilmsResponseDto> {
    return this.filmsService.getFilms();
  }

  @Get(':id/schedule')
  async getFilmSchedule(@Param('id') id: string): Promise<ScheduleResponseDto> {
    return this.filmsService.getFilmSchedule(id);
  }
  // В постмане опечатка, делаю дополнительный эндпоинт (может в автотестах тоже опечатка)
  @Get(':id/shedule')
  async getFilmShedule(@Param('id') id: string): Promise<ScheduleResponseDto> {
    return this.filmsService.getFilmSchedule(id);
  }
}
