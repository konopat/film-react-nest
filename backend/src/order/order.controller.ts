import { Controller, Post, Body } from '@nestjs/common';
import { OrderService } from './order.service';
import {
  CreateOrderDto,
  OrderResponseDto,
  OrderErrorDto,
} from './dto/order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(
    @Body() orders: CreateOrderDto[],
  ): Promise<OrderResponseDto | OrderErrorDto> {
    // Добавляем валидацию входных данных
    if (!orders) {
      return {
        total: 0,
        items: [],
        error: 'Тело запроса не может быть пустым',
      };
    }

    if (!Array.isArray(orders)) {
      return {
        total: 0,
        items: [],
        error: 'Ожидается массив заказов',
      };
    }

    return this.orderService.createOrder(orders);
  }
}
