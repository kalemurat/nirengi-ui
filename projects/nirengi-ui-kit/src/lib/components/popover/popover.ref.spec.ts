import { OverlayRef } from '@angular/cdk/overlay';
import { firstValueFrom, take } from 'rxjs';
import { PopoverRef } from './popover.ref';

describe('PopoverRef', () => {
  let overlayRef: OverlayRef;

  beforeEach(() => {
    overlayRef = {
      dispose: jasmine.createSpy('dispose'),
    } as unknown as OverlayRef;
  });

  it('should emit custom events', async () => {
    const ref = new PopoverRef(overlayRef, { data: { id: 1 } });
    const eventPromise = firstValueFrom(ref.events$.pipe(take(1)));

    ref.emit('save', { ok: true });

    await expectAsync(eventPromise).toBeResolvedTo({ key: 'save', data: { ok: true } });
  });

  it('should close, emit result and dispose overlay', async () => {
    const ref = new PopoverRef(overlayRef);
    const closePromise = firstValueFrom(ref.afterClosed().pipe(take(1)));

    ref.close('result');

    await expectAsync(closePromise).toBeResolvedTo('result');
    expect(overlayRef.dispose).toHaveBeenCalled();
  });
});
