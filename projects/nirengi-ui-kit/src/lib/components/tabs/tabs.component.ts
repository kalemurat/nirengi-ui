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
  /** @default ColorVariant.Primary */
  readonly variant = input<ColorVariant>(ColorVariant.Primary);

  /** @default Size.Medium */
  readonly size = input<Size>(Size.Medium);

  /**
   * Header items are distributed with equal width.
   *
   * @default false
   */
  readonly fullWidth = input<boolean>(false);

  readonly tabs = contentChildren(TabComponent);

  readonly activeIndex = signal<number>(0);

  /** Does not select the tab if it is disabled. */
  selectTab(index: number): void {
    const tab = this.tabs().at(index);
    if (tab && !tab.disabled()) {
      this.activeIndex.set(index);
    }
  }

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
