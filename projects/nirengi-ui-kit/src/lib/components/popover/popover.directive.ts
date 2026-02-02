import {
  Directive,
  ElementRef,
  HostListener,
  inject,
  input,
  OnDestroy,
  effect,
  ComponentRef,
  Type,
  output,
  Injector,
} from '@angular/core';
import {
  Overlay,
  OverlayRef,
  OverlayPositionBuilder,
  ConnectionPositionPair,
  PositionStrategy,
  OverlayConfig,
} from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { PopoverComponent } from './popover.component';
import { PopoverPosition } from './popover.types';
import { PopoverRef } from './popover.ref';

/**
 * Tıklandığında elementin yanında bir popover açan direktif.
 *
 * ## Kullanım
 *
 * ### 1. Temel Kullanım
 * ```html
 * <button [nirengiPopover]="MyContentComponent">Aç</button>
 * ```
 *
 * ### 2. Pozisyon Belirleme
 * ```html
 * <button
 *   [nirengiPopover]="MyContentComponent"
 *   [nirengiPopoverPosition]="PopoverPosition.Right">
 *   Sağda Aç
 * </button>
 * ```
 *
 * ### 3. Input Gönderme
 * Render edilen componente veri göndermek için `nirengiPopoverInputs` kullanın.
 * ```html
 * <button
 *   [nirengiPopover]="MyContentComponent"
 *   [nirengiPopoverInputs]="{ user: currentUser, title: 'Profil' }">
 *   Profil Detayı
 * </button>
 * ```
 * Component tarafında bu verileri `input()` signal ile karşılayabilirsiniz:
 * ```typescript
 * export class MyContentComponent {
 *   readonly user = input<User>();
 *   readonly title = input<string>();
 * }
 * ```
 *
 * ### 4. Output Dinleme (Event Handling)
 * Render edilen componentten gelen eventleri dinlemek için `nirengiPopoverOutput` kullanın.
 * Component içinde `PopoverRef.emit()` metodunu kullanarak event gönderebilirsiniz.
 * ```html
 * <button
 *   [nirengiPopover]="MyContentComponent"
 *   (nirengiPopoverOutput)="handlePopoverEvent($event)">
 *   İşlem Yap
 * </button>
 * ```
 * ```typescript
 * // Parent Component
 * handlePopoverEvent(event: { key: string, data: any }) {
 *   if (event.key === 'save') {
 *     console.log('Kaydedildi:', event.data);
 *   }
 * }
 *
 * // Content Component (Inside Popover)
 * export class MyContentComponent {
 *   private popoverRef = inject(PopoverRef);
 *
 *   save() {
 *     this.popoverRef.emit('save', { id: 123 });
 *   }
 * }
 * ```
 *
 * ### 5. Component İçinden Kapatma
 * `PopoverRef` servisini inject ederek popover'ı kapatabilirsiniz.
 * ```typescript
 * export class MyContentComponent {
 *   private popoverRef = inject(PopoverRef);
 *
 *   close() {
 *     this.popoverRef.close(); // İsteğe bağlı result dönebilir
 *   }
 * }
 * ```
 *
 * ### 6. Dışarı Tıklama ile Kapanmayı Engelleme
 * ```html
 * <button
 *   [nirengiPopover]="MyContentComponent"
 *   [nirengiPopoverCloseOnOutsideClick]="false">
 *   Kalıcı Popover
 * </button>
 * ```
 */
@Directive({
  selector: '[nirengiPopover]',
  standalone: true,
})
export class PopoverDirective implements OnDestroy {
  /**
   * Popover içinde gösterilecek component.
   */
  readonly nirengiPopover = input.required<Type<any>>();

  /**
   * Popover pozisyonu.
   * Varsayılan: Bottom
   */
  readonly nirengiPopoverPosition = input<PopoverPosition>(PopoverPosition.Bottom);

  /**
   * Dışarı tıklandığında popover'ın kapanıp kapanmayacağını belirler.
   * Varsayılan: true
   */
  readonly nirengiPopoverCloseOnOutsideClick = input<boolean>(true);

  /**
   * Popover içerik component'ine geçilecek inputlar.
   */
  readonly nirengiPopoverInputs = input<Record<string, unknown>>({});

  /**
   * Popover açıldığında tetiklenir
   */
  readonly popoverOpened = output<void>();

  /**
   * Popover kapandığında tetiklenir
   */
  readonly popoverClosed = output<void>();

  /**
   * Popover içeriğinden gelen eventleri dışarı iletir.
   * Component içinde `PopoverRef.emit('key', data)` kullanıldığında tetiklenir.
   */
  readonly nirengiPopoverOutput = output<{ key: string; data: any }>();

  private overlayRef: OverlayRef | null = null;
  private popoverRef: ComponentRef<PopoverComponent> | null = null;
  private isVisible = false;

  private readonly overlay = inject(Overlay);
  private readonly positionBuilder = inject(OverlayPositionBuilder);
  private readonly elementRef = inject(ElementRef);
  private readonly injector = inject(Injector);

  constructor() {
    // Input değişikliklerini dinle
    effect(() => {
      if (this.popoverRef) {
        this.popoverRef.setInput('content', this.nirengiPopover());
        this.popoverRef.setInput('position', this.nirengiPopoverPosition());
        this.popoverRef.setInput('componentInputs', this.nirengiPopoverInputs());

        // Pozisyon değişirse stratejiyi güncellemek gerekebilir (updatePositionStrategy)
        // Ancak OverlayRef yok edilip tekrar oluşturulmadıkça position strategy statiktir.
        if (this.overlayRef) {
          this.overlayRef.updatePosition();
        }
      }
    });
  }

  @HostListener('click')
  toggle(): void {
    if (this.isVisible) {
      this.close();
    } else {
      this.open();
    }
  }

  open(): void {
    if (this.isVisible) return;

    const positionStrategy = this.getPositionStrategy();
    const scrollStrategy = this.overlay.scrollStrategies.reposition();
    const closeOnOutside = this.nirengiPopoverCloseOnOutsideClick();

    const overlayConfig = new OverlayConfig({
      positionStrategy,
      scrollStrategy,
      // Eğer dışarı tıklamada kapatma isteniyorsa backdrop olmalı
      // İstenmiyorsa backdrop click'i dinlemeyiz ama overlay etkileşimi için transparent backdrop yine de işe yarayabilir
      // Ancak kullanıcı 'false' dediğinde genelde "başk a yere tıklayabileyim" ister.
      // O yüzden hasBackdrop'u sadece closeOnOutside true ise koyuyoruz.
      hasBackdrop: closeOnOutside,
      backdropClass: 'cdk-overlay-transparent-backdrop',
    });

    this.overlayRef = this.overlay.create(overlayConfig);

    // Backdrop click ile kapatma
    if (closeOnOutside) {
      this.overlayRef.backdropClick().subscribe(() => {
        this.close();
      });
    }

    const popoverRef = new PopoverRef(this.overlayRef);

    // PopoverRef'i inject etmek için özel injector oluştur
    const customInjector = Injector.create({
      providers: [{ provide: PopoverRef, useValue: popoverRef }],
      parent: this.injector,
    });

    // PopoverRef üzerinden kapatma isteğini dinle
    // (Render edilen component popoverRef.close() çağırdığında)
    popoverRef.afterClosed().subscribe(() => {
      // Overlay zaten dispose edildi, sadece local state temizliği yap
      this.destroyPopover();
    });

    // PopoverRef üzerinden gelen eventleri dinle ve dışarı aktar
    popoverRef.events$.subscribe((event) => {
      this.nirengiPopoverOutput.emit(event);
    });

    const popoverPortal = new ComponentPortal(PopoverComponent);
    this.popoverRef = this.overlayRef.attach(popoverPortal);

    this.popoverRef.setInput('content', this.nirengiPopover());
    this.popoverRef.setInput('position', this.nirengiPopoverPosition());
    this.popoverRef.setInput('componentInputs', this.nirengiPopoverInputs());
    this.popoverRef.setInput('injector', customInjector);

    // Animasyon için
    requestAnimationFrame(() => {
      if (this.popoverRef) {
        this.popoverRef.setInput('visible', true);
      }
    });

    this.isVisible = true;
    this.popoverOpened.emit();
  }

  close(): void {
    if (!this.isVisible) return;

    if (this.popoverRef) {
      this.popoverRef.setInput('visible', false);

      setTimeout(() => {
        this.destroyPopover();
      }, 200);
    }
  }

  private destroyPopover(): void {
    if (this.overlayRef) {
      // Eğer dışarıdan close çağrıldıysa ve ref hala varsa
      if (this.overlayRef.hasAttached()) {
        this.overlayRef.detach();
        this.overlayRef.dispose();
      }
      this.overlayRef = null;
    }
    this.popoverRef = null;

    // Sadece görünür durumdaysa emit et (tekrarı önlemek için)
    if (this.isVisible) {
      this.isVisible = false;
      this.popoverClosed.emit();
    }
  }

  ngOnDestroy(): void {
    if (this.overlayRef) {
      this.overlayRef.dispose();
    }
  }

  private getPositionStrategy(): PositionStrategy {
    const position = this.nirengiPopoverPosition();
    const positions: ConnectionPositionPair[] = this.getPositions(position);

    return this.positionBuilder
      .flexibleConnectedTo(this.elementRef)
      .withPositions(positions)
      .withPush(true);
  }

  private getPositions(position: PopoverPosition): ConnectionPositionPair[] {
    // Offset (gap) between trigger and popover
    const offset = 8;

    switch (position) {
      case PopoverPosition.Top:
        return [
          {
            originX: 'center',
            originY: 'top',
            overlayX: 'center',
            overlayY: 'bottom',
            offsetY: -offset,
          },
        ];
      case PopoverPosition.TopStart:
        return [
          {
            originX: 'start',
            originY: 'top',
            overlayX: 'start',
            overlayY: 'bottom',
            offsetY: -offset,
          },
        ];
      case PopoverPosition.TopEnd:
        return [
          { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom', offsetY: -offset },
        ];

      case PopoverPosition.Bottom:
        return [
          {
            originX: 'center',
            originY: 'bottom',
            overlayX: 'center',
            overlayY: 'top',
            offsetY: offset,
          },
        ];
      case PopoverPosition.BottomStart:
        return [
          {
            originX: 'start',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'top',
            offsetY: offset,
          },
        ];
      case PopoverPosition.BottomEnd:
        return [
          { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top', offsetY: offset },
        ];

      case PopoverPosition.Left:
        return [
          {
            originX: 'start',
            originY: 'center',
            overlayX: 'end',
            overlayY: 'center',
            offsetX: -offset,
          },
        ];
      case PopoverPosition.LeftStart:
        return [
          { originX: 'start', originY: 'top', overlayX: 'end', overlayY: 'top', offsetX: -offset },
        ];
      case PopoverPosition.LeftEnd:
        return [
          {
            originX: 'start',
            originY: 'bottom',
            overlayX: 'end',
            overlayY: 'bottom',
            offsetX: -offset,
          },
        ];

      case PopoverPosition.Right:
        return [
          {
            originX: 'end',
            originY: 'center',
            overlayX: 'start',
            overlayY: 'center',
            offsetX: offset,
          },
        ];
      case PopoverPosition.RightStart:
        return [
          { originX: 'end', originY: 'top', overlayX: 'start', overlayY: 'top', offsetX: offset },
        ];
      case PopoverPosition.RightEnd:
        return [
          {
            originX: 'end',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'bottom',
            offsetX: offset,
          },
        ];

      default:
        return [
          {
            originX: 'center',
            originY: 'bottom',
            overlayX: 'center',
            overlayY: 'top',
            offsetY: offset,
          },
        ];
    }
  }
}
