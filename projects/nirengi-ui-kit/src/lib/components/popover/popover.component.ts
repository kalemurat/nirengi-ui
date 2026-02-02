import {
    Component,
    ChangeDetectionStrategy,
    input,
    Type,
    computed
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopoverPosition } from './popover.types';

/**
 * Popover içeriğini sarmalayan component.
 * Direktif tarafından dinamik olarak oluşturulur ve içeriği gösterir.
 *
 * @example
 * // Bu component direkt olarak kullanılmaz, nirengiPopover direktifi üzerinden yönetilir.
 */
import { Injector } from '@angular/core';

@Component({
  selector: 'nirengi-popover',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="containerClasses()">
      <div class="popover__content">
        <ng-container *ngComponentOutlet="content(); injector: injector(); inputs: componentInputs()"></ng-container>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .popover {
        /* Temel popover stili */
        @apply z-50 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 p-4 min-w-[200px] transition-all duration-200 opacity-0 scale-95;

        /* Görünürlük kontrolü */
        &--visible {
          @apply opacity-100 scale-100;
        }

        /* İçerik alanı */
        &__content {
            @apply flex flex-col;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopoverComponent {
  /**
   * Gösterilecek içerik component'i.
   */
  readonly content = input.required<Type<any>>();

  /**
   * İçerik component'ine geçilecek inputlar.
   */
  readonly componentInputs = input<Record<string, unknown>>({});

  /**
   * İçerik component'i için injector.
   * PopoverRef gibi bağımlılıkları sağlamak için kullanılır.
   */
  readonly injector = input<Injector>();

  /**
   * Popover pozisyonu.
   */
  readonly position = input<PopoverPosition>(PopoverPosition.Bottom);

  /**
   * Görünürlük durumu.
   */
  readonly visible = input<boolean>(false);

  /**
   * Container stili için computed signal.
   */
  readonly containerClasses = computed(() => {
    const baseClass = 'popover';
    const positionClass = `popover--${this.position()}`;
    const visibleClass = this.visible() ? 'popover--visible' : '';

    // Pozisyona göre özel marginler eklenebilir
    return `${baseClass} ${positionClass} ${visibleClass}`;
  });
}
