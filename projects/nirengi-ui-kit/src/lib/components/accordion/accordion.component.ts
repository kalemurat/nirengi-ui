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
 * Accordion Component.
 * Title and content sections can be received as `TemplateRef` or `string`.
 *
 * ## Features
 * - ✅ Standalone Component
 * - ✅ OnPush Change Detection
 * - ✅ Signal-based state management
 * - ✅ Template projection and String content support
 * - ✅ Custom sizing & status
 *
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
  /**
   * Title.
   * Can be TemplateRef or string.
   */
  title = input.required<string | TemplateRef<any>>();

  /**
   * Content.
   * Can be TemplateRef or string.
   */
  content = input.required<string | TemplateRef<any>>();

  /**
   * Expanded/Collapsed state.
   * Supports two-way binding as it is a model signal.
   */
  expanded = model<boolean>(false);

  /**
   * Disabled state.
   */
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

  /**
   * Random string for unique ID generation.
   */
  private readonly uniqueId = Math.random().toString(36).substring(2, 9);

  /**
   * Header element ID.
   */
  protected readonly headerId = `accordion-header-${this.uniqueId}`;

  /**
   * Content element ID.
   */
  protected readonly contentId = `accordion-content-${this.uniqueId}`;

  /**
   * Calculates container CSS classes.
   */
  protected containerClasses = computed(() => {
    return [
      'nui-accordion',
      `nui-accordion--${this.size()}`,
      `nui-accordion--${this.status()}`,
      this.disabled() ? 'nui-accordion--disabled' : '',
      this.expanded() ? 'nui-accordion--open' : '',
    ].join(' ');
  });

  /**
   * Toggles the accordion state.
   */
  toggle() {
    if (!this.disabled()) {
      this.expanded.update((v) => !v);
    }
  }

  /**
   * Checks if the value is a TemplateRef.
   */
  protected isTemplate(value: any): value is TemplateRef<any> {
    return value instanceof TemplateRef;
  }
}

