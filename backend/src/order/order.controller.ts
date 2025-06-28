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
    return this.orderService.createOrder(orders);
  }
}
