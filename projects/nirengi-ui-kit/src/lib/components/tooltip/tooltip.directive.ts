import {
    Directive,
    ElementRef,
    HostListener,
    inject,
    input,
    OnDestroy,
    effect,
    ComponentRef,
} from '@angular/core';
import {
    Overlay,
    OverlayRef,
    OverlayPositionBuilder,
    ConnectionPositionPair,
    PositionStrategy,
} from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { TooltipComponent } from './tooltip.component';
import { TooltipPosition } from './tooltip.types';

/**
 * Element üzerine gelindiğinde tooltip gösteren direktif.
 * Angular CDK Overlay kullanarak pozisyonlama yapar.
 *
 * @example
 * <button [nirengiTooltip]="'İşlemi onayla'" [nirengiTooltipPosition]="TooltipPosition.Top">Onayla</button>
 */
@Directive({
  selector: '[nirengiTooltip]',
  standalone: true,
})
export class TooltipDirective implements OnDestroy {
  /**
   * Tooltip metni.
   */
  readonly nirengiTooltip = input.required<string>();

  /**
   * Tooltip pozisyonu.
   * Varsayılan: Top
   */
  readonly nirengiTooltipPosition = input<TooltipPosition>(TooltipPosition.Top);

  private overlayRef: OverlayRef | null = null;
  private tooltipRef: ComponentRef<TooltipComponent> | null = null;

  private readonly overlay = inject(Overlay);
  private readonly positionBuilder = inject(OverlayPositionBuilder);
  private readonly elementRef = inject(ElementRef);

  constructor() {
    // Input değişikliklerini dinle ve güncelle
    effect(() => {
      if (this.tooltipRef) {
        this.tooltipRef.setInput('text', this.nirengiTooltip());
        this.tooltipRef.setInput('position', this.nirengiTooltipPosition());
        // Pozisyon değişirse stratejiyi güncellemek gerekebilir ama şimdilik show/hide yeterli
      }
    });
  }

  /**
   * Mouse elementin üzerine geldiğinde çalışır.
   */
  @HostListener('mouseenter')
  show(): void {
    if (this.overlayRef) {
      // Zaten varsa gösterme (veya kapatıp aç)
      return;
    }

    const positionStrategy = this.getPositionStrategy();
    this.overlayRef = this.overlay.create({ positionStrategy });

    // Component'i oluştur ve overlay'e ekle
    const tooltipPortal = new ComponentPortal(TooltipComponent);
    this.tooltipRef = this.overlayRef.attach(tooltipPortal);

    // Component inputlarını set et
    this.tooltipRef.setInput('text', this.nirengiTooltip());
    this.tooltipRef.setInput('position', this.nirengiTooltipPosition());

    // Görünür yap (animasyon için)
    // setTimeout ile bir sonraki tick'e bırakarak transition'ın çalışmasını sağla
    requestAnimationFrame(() => {
      if (this.tooltipRef) {
        this.tooltipRef.setInput('visible', true);
      }
    });
  }

  /**
   * Mouse elementin üzerinden ayrıldığında çalışır.
   */
  @HostListener('mouseleave')
  hide(): void {
    if (this.tooltipRef) {
      this.tooltipRef.setInput('visible', false);
      // Animasyonun bitmesini bekle ve sonra yok et
      setTimeout(() => {
        if (this.overlayRef) {
          this.overlayRef.detach();
          this.overlayRef.dispose();
          this.overlayRef = null;
          this.tooltipRef = null;
        }
      }, 200); // 200ms transition süresi CSS ile uyumlu olmalı
    }
  }

  ngOnDestroy(): void {
    if (this.overlayRef) {
      this.overlayRef.dispose();
    }
  }

  /**
   * Pozisyon stratejisini oluşturur.
   */
  private getPositionStrategy(): PositionStrategy {
    const position = this.nirengiTooltipPosition();
    let positions: ConnectionPositionPair[] = [];

    // Overlay pozisyonlarını oluştur
    // Basit bir yaklaşım, daha gelişmişi için ConnectedPosition kullanılabilir
    switch (position) {
      case TooltipPosition.Top:
        positions.push({
          originX: 'center',
          originY: 'top',
          overlayX: 'center',
          overlayY: 'bottom',
          offsetY: -8, // Aradaki boşluk
        });
        break;
      case TooltipPosition.Bottom:
        positions.push({
          originX: 'center',
          originY: 'bottom',
          overlayX: 'center',
          overlayY: 'top',
          offsetY: 8,
        });
        break;
      case TooltipPosition.Left:
        positions.push({
          originX: 'start',
          originY: 'center',
          overlayX: 'end',
          overlayY: 'center',
          offsetX: -8,
        });
        break;
      case TooltipPosition.Right:
        positions.push({
          originX: 'end',
          originY: 'center',
          overlayX: 'start',
          overlayY: 'center',
          offsetX: 8,
        });
        break;
    }

    // Pozisyon stratejisini oluştur
    return this.positionBuilder
      .flexibleConnectedTo(this.elementRef)
      .withPositions(positions)
      .withPush(false); // Ekran dışına taşmayı engellemek için true yapılabilir
  }
}
