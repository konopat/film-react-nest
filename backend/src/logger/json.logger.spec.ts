import { JsonLogger } from './json.logger';

describe('JsonLogger', () => {
  let logger: JsonLogger;
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new JsonLogger();
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  describe('log', () => {
    it('должен форматировать сообщение в JSON', () => {
      const message = 'test message';
      const params = ['param1', 'param2'];

      logger.log(message, ...params);

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringMatching(
          /^{"level":"log","message":"test message","optionalParams":\[\["param1","param2"\]\],"timestamp":".*"}$/,
        ),
      );
    });
  });

  describe('error', () => {
    it('должен форматировать ошибку в JSON', () => {
      const errorMessage = 'error message';

      logger.error(errorMessage);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringMatching(
          /^{"level":"error","message":"error message","optionalParams":\[\[\]\],"timestamp":".*"}$/,
        ),
      );
    });
  });
});
