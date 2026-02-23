import { ToastService } from './toast.service';
import { ToastVariant } from './toast.types';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    service = new ToastService();
    spyOn(crypto, 'randomUUID').and.returnValue('00000000-0000-4000-8000-000000000000');
  });

  it('should create success toast with defaults', () => {
    service.success({ title: 'Success', description: 'Done' });

    const toasts = service.toasts();
    expect(toasts.length).toBe(1);
    expect(toasts[0]).toEqual(
      jasmine.objectContaining({
        id: '00000000-0000-4000-8000-000000000000',
        title: 'Success',
        description: 'Done',
        variant: ToastVariant.Success,
        options: {
          duration: 3000,
          position: 'top-right',
        },
      })
    );
  });

  it('should create variant-specific toasts', () => {
    service.error({ title: 'Error', description: 'Oops' });
    service.info({ title: 'Info', description: 'FYI' });
    service.warning({ title: 'Warn', description: 'Careful' });

    const variants = service.toasts().map((toast) => toast.variant);
    expect(variants).toEqual([ToastVariant.Error, ToastVariant.Info, ToastVariant.Warning]);
  });

  it('should merge custom options and remove toast by id', () => {
    service.success({
      title: 'Success',
      description: 'Done',
      options: { duration: 5000, position: 'bottom-left' },
    });

    expect(service.toasts()[0].options).toEqual({ duration: 5000, position: 'bottom-left' });

    service.remove('00000000-0000-4000-8000-000000000000');
    expect(service.toasts()).toEqual([]);
  });
});
