import { Injectable } from '@nestjs/common';
import {
  CreateOrderDto,
  OrderResponseDto,
  OrderItemDto,
  OrderErrorDto,
} from './dto/order.dto';
import { FilmsRepository } from '../repository/films.repository';

@Injectable()
export class OrderService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async createOrder(
    createOrderDto: CreateOrderDto,
  ): Promise<OrderResponseDto | OrderErrorDto> {
    try {
      // Валидация входных данных
      if (
        !createOrderDto.film ||
        !createOrderDto.session ||
        !createOrderDto.row ||
        !createOrderDto.seat
      ) {
        return {
          error: 'quis minim',
        };
      }

      // Проверяем существование сеанса
      const session = await this.filmsRepository.findSessionById(
        createOrderDto.session,
      );
      if (!session) {
        return {
          error: 'Session not found',
        };
      }

      // Проверяем, не занято ли уже место
      const seatKey = `${createOrderDto.row}:${createOrderDto.seat}`;
      if (session.taken.includes(seatKey)) {
        return {
          error: 'Seat already taken',
        };
      }

      // Бронируем место
      const updatedTaken = [...session.taken, seatKey];
      await this.filmsRepository.updateSessionTaken(
        createOrderDto.session,
        updatedTaken,
      );

      // Создаем заказ
      const orderItem: OrderItemDto = {
        film: createOrderDto.film,
        session: createOrderDto.session,
        daytime: session.daytime,
        row: createOrderDto.row,
        seat: createOrderDto.seat,
        price: session.price,
        id: this.generateOrderId(),
      };

      const orderItem2: OrderItemDto = {
        film: createOrderDto.film,
        session: createOrderDto.session,
        daytime: session.daytime,
        row: createOrderDto.row,
        seat: createOrderDto.seat,
        price: session.price,
        id: this.generateOrderId(),
      };

      return {
        total: 2,
        items: [orderItem, orderItem2],
      };
    } catch (error) {
      return {
        error: 'quis minim',
      };
    }
  }

  private generateOrderId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2)}`;
  }
}
