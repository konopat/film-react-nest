//TODO реализовать DTO для /orders

export class CreateOrderDto {
  film: string;
  session: string;
  row: number;
  seat: number;
  daytime?: string;
  price?: number;
}

export class OrderItemDto {
  film: string;
  session: string;
  daytime: string;
  row: number;
  seat: number;
  price: number;
  id: string;
}

export class OrderResponseDto {
  total: number;
  items: OrderItemDto[];
  error?: string;
}

export class OrderErrorDto {
  total: number;
  items: never[];
  error: string;
}
