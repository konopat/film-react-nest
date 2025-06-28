import { Injectable } from '@nestjs/common';
import {
  CreateOrderDto,
  OrderResponseDto,
  OrderItemDto,
  OrderErrorDto,
} from './dto/order.dto';

@Injectable()
export class OrderService {
  createOrder(
    createOrderDto: CreateOrderDto,
  ): OrderResponseDto | OrderErrorDto {
    try {
      // Простая валидация для демонстрации
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

      // Пустышка с примерными данными
      const mockOrderItem: OrderItemDto = {
        film: createOrderDto.film,
        session: createOrderDto.session,
        daytime: '2023-05-29T10:30:00.001Z',
        row: createOrderDto.row,
        seat: createOrderDto.seat,
        price: 350,
        id: 'c2260f3b-6ca0-453f-f379-96ffa676089d',
      };

      const mockOrderItem2: OrderItemDto = {
        film: createOrderDto.film,
        session: createOrderDto.session,
        daytime: '2023-05-29T10:30:00.001Z',
        row: createOrderDto.row,
        seat: createOrderDto.seat,
        price: 350,
        id: 'urn:uuid:ee261ff4-dc3a-cea9-d4f5-3aeb22e1abac',
      };

      return {
        total: 2,
        items: [mockOrderItem, mockOrderItem2],
      };
    } catch (error) {
      return {
        error: 'quis minim',
      };
    }
  }
}
