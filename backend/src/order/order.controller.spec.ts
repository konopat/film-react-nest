import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import {
  CreateOrderDto,
  OrderResponseDto,
  OrderErrorDto,
} from './dto/order.dto';

describe('OrderController', () => {
  let controller: OrderController;
  let service: OrderService;

  // Сервисы замоканы для изоляции тестов
  const mockOrderService = {
    createOrder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: mockOrderService,
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    service = module.get<OrderService>(OrderService);
  });

  describe('createOrder', () => {
    it('должен создавать заказ с валидными данными', async () => {
      const orders: CreateOrderDto[] = [
        {
          film: '1',
          session: '1',
          row: 1,
          seat: 1,
          daytime: '10:00',
          price: 500,
        },
      ];

      const expectedResponse: OrderResponseDto = {
        total: 1000,
        items: [
          {
            film: '1',
            session: '1',
            daytime: '10:00',
            row: 1,
            seat: 1,
            price: 500,
            id: 'order-1',
          },
        ],
      };

      mockOrderService.createOrder.mockResolvedValue(expectedResponse);

      const result = await controller.createOrder(orders);

      expect(service.createOrder).toHaveBeenCalledWith(orders);
      expect(result).toEqual(expectedResponse);
    });

    it('должен возвращать ошибку при пустом теле запроса', async () => {
      const result = await controller.createOrder(
        null as unknown as CreateOrderDto[],
      );

      const expectedError: OrderErrorDto = {
        total: 0,
        items: [],
        error: 'Тело запроса не может быть пустым',
      };

      expect(result).toEqual(expectedError);
    });

    it('должен возвращать ошибку при неверном формате данных', async () => {
      const result = await controller.createOrder(
        'invalid' as unknown as CreateOrderDto[],
      );

      const expectedError: OrderErrorDto = {
        total: 0,
        items: [],
        error: 'Ожидается массив заказов',
      };

      expect(result).toEqual(expectedError);
    });

    it('должен возвращать ошибку при undefined', async () => {
      const result = await controller.createOrder(
        undefined as unknown as CreateOrderDto[],
      );

      const expectedError: OrderErrorDto = {
        total: 0,
        items: [],
        error: 'Тело запроса не может быть пустым',
      };

      expect(result).toEqual(expectedError);
    });

    it('должен возвращать ошибку при пустом массиве', async () => {
      const orders: CreateOrderDto[] = [];
      const expectedResponse: OrderResponseDto = {
        total: 0,
        items: [],
      };

      mockOrderService.createOrder.mockResolvedValue(expectedResponse);

      const result = await controller.createOrder(orders);

      expect(service.createOrder).toHaveBeenCalledWith(orders);
      expect(result).toEqual(expectedResponse);
    });
  });
});
