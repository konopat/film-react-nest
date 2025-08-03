import { TskvLogger } from './tskv.logger';

describe('TskvLogger', () => {
  let logger: TskvLogger;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new TskvLogger();
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  describe('log', () => {
    it('должен форматировать сообщение в TSKV формате', () => {
      const message = 'test message';

      logger.log(message);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringMatching(
          /^time=.*\tlevel=log\tmessage=test message\tparams=\[\[\]\]$/,
        ),
      );
    });

    it('должен корректно обрабатывать параметры', () => {
      const message = 'test message';
      const params = ['param1', 'param2'];

      logger.log(message, ...params);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringMatching(
          /^time=.*\tlevel=log\tmessage=test message\tparams=\[.*\]$/,
        ),
      );
    });
  });
});
