import { Component, input, computed, ChangeDetectionStrategy, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Size } from '../../common/enums/size.enum';

/** Defines the properties for each breadcrumb link or text. */
export interface BreadcrumbItem {
  label: string;

  /** If not defined, the item will not be clickable (rendered as a span). */
  url?: string | any[];

  fragment?: string;

  queryParams?: any;

  /** If true, the item is not clickable and takes a disabled style. */
  disabled?: boolean;

  /** Reserved for icon support (not yet functional). */
  icon?: string;
}

/**
 * Breadcrumb navigation component. Shows the user's location within the app hierarchy.
 *
 * @example
 * // Simple usage
 * <nui-breadcrumb [items]="items"></nui-breadcrumb>
 *
 * @example
 * // With custom separator
 * <nui-breadcrumb [items]="items" separator=">"></nui-breadcrumb>
 *
 * @example
 * // With template separator
 * <ng-template #sepIcon><i class="icon-chevron-right"></i></ng-template>
 * <nui-breadcrumb [items]="items" [separator]="sepIcon"></nui-breadcrumb>
 *
 * @see {@link Size}
 */
@Component({
  selector: 'nui-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbComponent {
  readonly items = input.required<BreadcrumbItem[]>();

  /**
   * Separator between items. Can be a string (e.g. `'/'`, `'>'`) or a `TemplateRef`.
   *
   * @default '/'
   */
  readonly separator = input<string | TemplateRef<any>>('/');

  /** @default Size.Medium */
  readonly size = input<Size>(Size.Medium);

  readonly containerClasses = computed(() => {
    const classes = ['nui-breadcrumb'];
    classes.push(`nui-breadcrumb--${this.size()}`);
    return classes.join(' ');
  });

  readonly listClasses = computed(() => {
    return 'nui-breadcrumb__list';
  });

  readonly itemClasses = computed(() => {
    const classes = ['nui-breadcrumb__item'];
    classes.push(`nui-breadcrumb__item--${this.size()}`);
    return classes.join(' ');
  });

  protected isTemplate(value: string | TemplateRef<any>): boolean {
    return value instanceof TemplateRef;
  }
}
