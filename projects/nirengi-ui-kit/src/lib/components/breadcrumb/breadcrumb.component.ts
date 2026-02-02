import { Component, input, computed, ChangeDetectionStrategy, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Size } from '../../common/enums/size.enum';

/**
 * Breadcrumb item interface.
 * Defines the necessary properties for each breadcrumb link or text.
 */
export interface BreadcrumbItem {
  /**
   * Display text.
   */
  label: string;

  /**
   * Target route.
   * Should be in the format accepted by the RouterLink directive (string or array).
   * If not defined, the item will not be clickable (rendered as a span).
   */
  url?: string | any[];

  /**
   * URL fragment (#anchor).
   */
  fragment?: string;

  /**
   * URL query parameters.
   */
  queryParams?: any;

  /**
   * Determines whether the item is active (disabled).
   * If true, it is not clickable and takes a disabled style.
   */
  disabled?: boolean;

  /**
   * Optional icon class or name (if icon support is added).
   */
  icon?: string;
}

/**
 * Modern breadcrumb component.
 * Shows the user's location within the application and provides hierarchical navigation.
 * Uses Angular 20 signal-based API and Tailwind + BEM methodology.
 *
 * ## Features
 * - ✅ Signal-based inputs
 * - ✅ OnPush change detection strategy
 * - ✅ Reactive class binding with computed signals
 * - ✅ Customizable separator
 * - ✅ RouterLink integration
 * - ✅ Different size options (sm, md, lg)
 * - ✅ Responsive design compatible
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
 * @see https://v20.angular.dev/guide/signals
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
  /**
   * List of breadcrumb items.
   * Forms the navigation chain.
   */
  readonly items = input.required<BreadcrumbItem[]>();

  /**
   * Separator character or template between items.
   * Can be a string (e.g., '/', '>') or TemplateRef.
   *
   * @default '/'
   */
  readonly separator = input<string | TemplateRef<any>>('/');

  /**
   * Component size.
   * Affects text and icon sizes.
   *
   * @default Size.Medium
   */
  readonly size = input<Size>(Size.Medium);

  /**
   * Computed signal to calculate CSS classes for the main container.
   */
  readonly containerClasses = computed(() => {
    const classes = ['nui-breadcrumb'];
    classes.push(`nui-breadcrumb--${this.size()}`);
    return classes.join(' ');
  });

  /**
   * CSS classes for the list (ol).
   */
  readonly listClasses = computed(() => {
    return 'nui-breadcrumb__list';
  });

  /**
   * Base class for the list item (li).
   */
  readonly itemClasses = computed(() => {
    const classes = ['nui-breadcrumb__item'];
    classes.push(`nui-breadcrumb__item--${this.size()}`);
    return classes.join(' ');
  });

  /**
   * Checks if it is a template.
   * Checking if it is a TemplateRef will be done within the template.
   */
  protected isTemplate(value: string | TemplateRef<any>): boolean {
    return value instanceof TemplateRef;
  }
}

