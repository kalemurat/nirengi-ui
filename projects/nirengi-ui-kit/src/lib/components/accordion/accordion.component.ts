
import {
    ChangeDetectionStrategy,
    Component,
    TemplateRef,
    computed,
    input,
    model
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';
import { Size } from '../../common/enums/size.enum';

/**
 * Accordion bileşeninin durum varyantları.
 */
export type AccordionStatus = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';

/**
 * Accordion Component.
 * Başlık ve içerik kısımları `TemplateRef` veya `string` olarak alınabilir.
 * 
 * ## Özellikler
 * - ✅ Standalone Component
 * - ✅ OnPush Change Detection
 * - ✅ Signal-based state management
 * - ✅ Template projection ve String content desteği
 * - ✅ Custom sizing & status
 * 
 * @example
 * <!-- String Usage -->
 * <nui-accordion 
 *   title="Başlık"
 *   content="İçerik"
 *   size="md"
 *   status="primary">
 * </nui-accordion>
 * 
 * <!-- Template Usage -->
 * <nui-accordion 
 *   [title]="titleTpl"
 *   [content]="contentTpl">
 * </nui-accordion>
 * 
 * <ng-template #titleTpl><strong>Custom Başlık</strong></ng-template>
 * <ng-template #contentTpl>Custom İçerik</ng-template>
 */
@Component({
  selector: 'nui-accordion',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './accordion.component.html',
  styleUrl: './accordion.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccordionComponent {
  /**
   * Başlık.
   * TemplateRef veya string olabilir.
   */
  title = input.required<string | TemplateRef<any>>();

  /**
   * İçerik.
   * TemplateRef veya string olabilir.
   */
  content = input.required<string | TemplateRef<any>>();

  /**
   * Açık/Kapalı durumu.
   * Model signal olduğu için iki yönlü binding destekler.
   */
  expanded = model<boolean>(false);

  /**
   * Devre dışı bırakma durumu.
   */
  disabled = input<boolean>(false);

  /**
   * Bileşen boyutu.
   * @default Size.Medium
   */
  size = input<Size | 'sm' | 'md' | 'lg'>(Size.Medium);

  /**
   * Durum rengi/varyantı.
   * @default 'default'
   */
  status = input<AccordionStatus>('default');

  /**
   * Unique ID üretimi için random string.
   */
  private readonly uniqueId = Math.random().toString(36).substring(2, 9);
  
  /**
   * Header elementi ID'si.
   */
  protected readonly headerId = `accordion-header-${this.uniqueId}`;
  
  /**
   * Content elementi ID'si.
   */
  protected readonly contentId = `accordion-content-${this.uniqueId}`;

  /**
   * Container CSS sınıflarını hesaplar.
   */
  protected containerClasses = computed(() => {
    return [
      'nui-accordion',
      `nui-accordion--${this.size()}`,
      `nui-accordion--${this.status()}`,
      this.disabled() ? 'nui-accordion--disabled' : '',
      this.expanded() ? 'nui-accordion--open' : ''
    ].join(' ');
  });

  /**
   * Accordion durumunu değiştirir.
   */
  toggle() {
    if (!this.disabled()) {
      this.expanded.update(v => !v);
    }
  }

  /**
   * Değerin TemplateRef olup olmadığını kontrol eder.
   */
  protected isTemplate(value: any): value is TemplateRef<any> {
    return value instanceof TemplateRef;
  }
}
