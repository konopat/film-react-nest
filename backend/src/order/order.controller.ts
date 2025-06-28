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
  createOrder(
    @Body() createOrderDto: CreateOrderDto,
  ): OrderResponseDto | OrderErrorDto {
    return this.orderService.createOrder(createOrderDto);
  }
}
