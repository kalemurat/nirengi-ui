import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  input,
  model,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
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
  imports: [NgTemplateOutlet],
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

  /**
   * Index of the active tab. Bind `[activeIndex]` to open a given tab (for example one taken
   * from the URL), or `[(activeIndex)]` to also follow the user's clicks; `(activeIndexChange)`
   * emits the clicked tab's index. A disabled or out-of-range index never activates that tab:
   * the first enabled tab is shown instead, and the bound value is left as given.
   *
   * @default 0
   */
  readonly activeIndex = model<number>(0);

  /** The tab actually shown: `activeIndex` when it names an enabled tab, else the first enabled one. */
  protected readonly currentIndex = computed(() => {
    const tabs = this.tabs();
    const index = this.activeIndex();
    // `Array.at` counts a negative index from the end, so the range is checked explicitly.
    const inRange = Number.isInteger(index) && index >= 0 && index < tabs.length;
    if (inRange && !tabs[index].disabled()) return index;
    return tabs.findIndex((tab) => !tab.disabled());
  });

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

  /** Does not select the tab if it is disabled. */
  selectTab(index: number): void {
    const tab = index >= 0 ? this.tabs()[index] : undefined;
    if (tab && !tab.disabled()) {
      this.activeIndex.set(index);
    }
  }
}
