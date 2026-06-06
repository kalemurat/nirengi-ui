import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  computed,
  input,
  model,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';
import { Size } from '../../common/enums/size.enum';

/**
 * Status variants of the Accordion component.
 */
export type AccordionStatus = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';

/**
 * @example
 * <!-- String Usage -->
 * <nui-accordion
 *   title="Title"
 *   content="Content"
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
 * <ng-template #titleTpl><strong>Custom Title</strong></ng-template>
 * <ng-template #contentTpl>Custom Content</ng-template>
 */
@Component({
  selector: 'nui-accordion',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './accordion.component.html',
  styleUrl: './accordion.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccordionComponent {
  title = input.required<string | TemplateRef<any>>();

  content = input.required<string | TemplateRef<any>>();

  expanded = model<boolean>(false);

  disabled = input<boolean>(false);

  /**
   * Component size.
   * @default Size.Medium
   */
  size = input<Size | 'sm' | 'md' | 'lg'>(Size.Medium);

  /**
   * Status color/variant.
   * @default 'default'
   */
  status = input<AccordionStatus>('default');

  private readonly uniqueId = Math.random().toString(36).substring(2, 9);

  protected readonly headerId = `accordion-header-${this.uniqueId}`;

  protected readonly contentId = `accordion-content-${this.uniqueId}`;

  protected containerClasses = computed(() => {
    return [
      'nui-accordion',
      `nui-accordion--${this.size()}`,
      `nui-accordion--${this.status()}`,
      this.disabled() ? 'nui-accordion--disabled' : '',
      this.expanded() ? 'nui-accordion--open' : '',
    ].join(' ');
  });

  /** Does not toggle while disabled. */
  toggle() {
    if (!this.disabled()) {
      this.expanded.update((v) => !v);
    }
  }

  protected isTemplate(value: any): value is TemplateRef<any> {
    return value instanceof TemplateRef;
  }
}
