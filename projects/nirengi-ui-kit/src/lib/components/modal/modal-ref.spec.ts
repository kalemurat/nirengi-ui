import { ModalRef } from './modal-ref';

describe('ModalRef', () => {
  it('should close with result, call callback and resolve promise', async () => {
    const closeCallback = jasmine.createSpy('closeCallback');
    const ref = new ModalRef<string>('modal-1', closeCallback);

    ref.close('done');
    const result = await ref.afterClosedPromise;

    expect(closeCallback).toHaveBeenCalledWith('modal-1', 'done');
    expect(ref.afterClosed()).toBe('done');
    expect(result).toBe('done');
  });

  it('should close without result', async () => {
    const closeCallback = jasmine.createSpy('closeCallback');
    const ref = new ModalRef('modal-2', closeCallback);

    ref.close();
    const result = await ref.afterClosedPromise;

    expect(closeCallback).toHaveBeenCalledWith('modal-2', undefined);
    expect(result).toBeUndefined();
  });
});
