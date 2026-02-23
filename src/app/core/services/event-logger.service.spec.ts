import { EventLoggerService } from './event-logger.service';

describe('EventLoggerService', () => {
  let service: EventLoggerService;

  beforeEach(() => {
    service = new EventLoggerService();
  });

  it('should log event with sanitized object payload', () => {
    service.logEvent('button', 'click', { value: 1 });

    const [log] = service.eventLogs();
    expect(log.componentId).toBe('button');
    expect(log.eventName).toBe('click');
    expect(log.payload).toEqual({ value: 1 });
    expect(typeof log.id).toBe('string');
  });

  it('should sanitize DOM Event payload', () => {
    const button = document.createElement('button');
    const event = new MouseEvent('click');
    Object.defineProperty(event, 'target', { value: button });

    service.logEvent('button', 'click', event);

    const [log] = service.eventLogs();
    expect(log.payload).toEqual(
      jasmine.objectContaining({
        type: 'click',
        target: 'BUTTON',
      })
    );
  });

  it('should sanitize DOM Event payload with unknown target', () => {
    const event = new Event('change');
    Object.defineProperty(event, 'target', { value: null });

    service.logEvent('input', 'change', event);

    const [log] = service.eventLogs();
    expect(log.payload).toEqual(
      jasmine.objectContaining({
        type: 'change',
        target: 'unknown',
      })
    );
  });

  it('should fallback to string for circular payload', () => {
    const payload: { name: string; self?: unknown } = { name: 'circular' };
    payload.self = payload;

    service.logEvent('demo', 'change', payload);

    const [log] = service.eventLogs();
    expect(log.payload).toContain('[object Object]');
  });

  it('should return recent logs and clear logs', () => {
    service.logEvent('a', 'e1', 1);
    service.logEvent('a', 'e2', 2);
    service.logEvent('a', 'e3', 3);

    const recent = service.getRecentLogs(2);
    expect(recent.length).toBe(2);
    expect(recent[0].eventName).toBe('e3');

    service.clearLogs();
    expect(service.eventLogs()).toEqual([]);
  });
});
