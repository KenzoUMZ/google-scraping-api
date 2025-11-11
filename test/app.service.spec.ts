import { AppService } from '../src/app.service';

describe('AppService', () => {
  it('getHello should return greeting', () => {
    const svc = new AppService();
    expect(svc.getHello()).toBe('Hello World!');
  });
});
