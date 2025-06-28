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
    orders: CreateOrderDto[],
  ): Promise<OrderResponseDto | OrderErrorDto> {
    try {
      if (!Array.isArray(orders) || orders.length === 0) {
        return {
          total: 0,
          items: [],
          error: 'Список заказов не может быть пустым',
        };
      }

      const orderItems: OrderItemDto[] = [];
      const processedSeats = new Set<string>(); // Для предотвращения дублирования в рамках одного запроса

      for (const orderDto of orders) {
        // Извлекаем только нужные поля из запроса
        const cleanOrderDto = this.extractOrderFields(orderDto);
        const result = await this.processOrderItem(
          cleanOrderDto,
          processedSeats,
        );
        if ('error' in result) {
          return {
            total: 0,
            items: [],
            error: result.error,
          }; // Возвращаем ошибку при первой неудаче
        }
        orderItems.push(result);
        processedSeats.add(
          `${cleanOrderDto.session}:${result.row}:${result.seat}`,
        );
      }

      return {
        total: orderItems.length,
        items: orderItems,
      };
    } catch (error) {
      return {
        total: 0,
        items: [],
        error: 'Внутренняя ошибка сервера',
      };
    }
  }

  private extractOrderFields(orderDto: any): CreateOrderDto {
    // Проверяем что orderDto существует
    if (!orderDto || typeof orderDto !== 'object') {
      return {
        film: undefined,
        session: undefined,
        row: undefined,
        seat: undefined,
      };
    }

    return {
      film: orderDto.film,
      session: orderDto.session,
      row: orderDto.row,
      seat: orderDto.seat,
    };
  }

  private async processOrderItem(
    createOrderDto: CreateOrderDto,
    processedSeats: Set<string>,
  ): Promise<OrderItemDto | { error: string }> {
    try {
      // Валидация входных данных
      if (
        !createOrderDto.film ||
        !createOrderDto.session ||
        createOrderDto.row === undefined ||
        createOrderDto.seat === undefined
      ) {
        return {
          error: 'Недостаточно данных для создания заказа',
        };
      }

      // Валидация номеров ряда и места
      const row = Number(createOrderDto.row);
      const seat = Number(createOrderDto.seat);

      if (
        !Number.isInteger(row) ||
        !Number.isInteger(seat) ||
        row <= 0 ||
        seat <= 0
      ) {
        return {
          error: 'Номер ряда и места должны быть положительными целыми числами',
        };
      }

      // Проверяем дублирование в рамках текущего запроса
      const requestSeatKey = `${createOrderDto.session}:${row}:${seat}`;
      if (processedSeats.has(requestSeatKey)) {
        return {
          error: `Место ${row}:${seat} уже обрабатывается в этом запросе`,
        };
      }

      // Проверяем существование сеанса
      const session = await this.filmsRepository.findSessionById(
        createOrderDto.session,
      );
      if (!session) {
        return {
          error: 'Сеанс не найден',
        };
      }

      // Проверяем, что место находится в пределах зала
      if (row > session.rows || seat > session.seats) {
        return {
          error: `Место ${row}:${seat} не существует. Зал имеет ${session.rows} рядов и ${session.seats} мест в ряду`,
        };
      }

      // Создаем ключ места в формате ${row}:${seat}
      const seatKey = `${row}:${seat}`;

      // Проверяем, не занято ли уже место
      if (session.taken.includes(seatKey)) {
        return {
          error: `Место ${seatKey} уже занято`,
        };
      }

      // Бронируем место - добавляем в список занятых
      const updatedTaken = [...session.taken, seatKey];
      const updateSuccess = await this.filmsRepository.updateSessionTaken(
        createOrderDto.session,
        updatedTaken,
      );

      if (!updateSuccess) {
        return {
          error: 'Ошибка при бронировании места',
        };
      }

      // Создаем заказ
      const orderItem: OrderItemDto = {
        film: createOrderDto.film,
        session: createOrderDto.session,
        daytime: session.daytime,
        row: row,
        seat: seat,
        price: session.price,
        id: this.generateOrderId(),
      };

      return orderItem;
    } catch (error) {
      return {
        error: 'Внутренняя ошибка сервера',
      };
    }
  }

  private generateOrderId(): string {
    return `order-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  }
}
