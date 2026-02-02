import {
    ChangeDetectionStrategy,
    Component,
    computed,
    contentChildren,
    input,
    signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabComponent } from './tab.component';
import { Size } from '../../common/enums/size.enum';
import { ColorVariant } from '../../common/enums/color-variant.enum';

/**
 * Tabs component.
 * Dynamically manages tabs and displays the content of the selected tab.
 *
 * ## Features
 * - ✅ Standalone and OnPush
 * - ✅ Signal-based
 * - ✅ BEM and Tailwind styles
 * - ✅ Accessibility (ARIA)
 *
 * @example
 * <nui-tabs [variant]="ColorVariant.Primary">
 *   <nui-tab label="General">
 *     General settings content...
 *   </nui-tab>
 *   <nui-tab label="Advanced">
 *     Advanced settings content...
 *   </nui-tab>
 * </nui-tabs>
 */
@Component({
  selector: 'nui-tabs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsComponent {
  /**
   * Tabs component color variant.
   * Determines the highlight color of the active tab.
   *
   * @default ColorVariant.Primary
   */
  readonly variant = input<ColorVariant>(ColorVariant.Primary);

  /**
   * Tabs component size.
   * Determines the padding and font size of the header items.
   *
   * @default Size.Medium
   */
  readonly size = input<Size>(Size.Medium);

  /**
   * Enables full width mode.
   * Header items are distributed with equal width.
   *
   * @default false
   */
  readonly fullWidth = input<boolean>(false);

  /**
   * Child tab components.
   * Captures n-tab elements coming from content projection.
   */
  readonly tabs = contentChildren(TabComponent);

  /**
   * Selected tab index.
   * Default is 0 (first tab).
   */
  readonly activeIndex = signal<number>(0);

  /**
   * Selects a tab.
   * No action is taken if the tab is disabled.
   *
   * @param index Tab index to be selected
   */
  selectTab(index: number): void {
    const tab = this.tabs().at(index);
    if (tab && !tab.disabled()) {
      this.activeIndex.set(index);
    }
  }

  /**
   * Calculates container CSS classes.
   * Returns a class list based on size, variant, and fullWidth state.
   */
  protected readonly containerClasses = computed(() => {
    const classes = ['nui-tabs'];

    // Size class
    classes.push(`nui-tabs--${this.size()}`);

    // Variant class
    classes.push(`nui-tabs--${this.variant()}`);

    // Full width class
    if (this.fullWidth()) {
      classes.push('nui-tabs--full-width');
    }

    return classes.join(' ');
  });
}

