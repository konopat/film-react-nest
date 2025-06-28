import { Controller, Get, Param } from '@nestjs/common';
import { FilmsService } from './films.service';
import { FilmsResponseDto, ScheduleResponseDto } from './dto/films.dto';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  getFilms(): FilmsResponseDto {
    return this.filmsService.getFilms();
  }

  @Get(':id/schedule')
  getFilmSchedule(@Param('id') id: string): ScheduleResponseDto {
    return this.filmsService.getFilmSchedule(id);
  }
}
