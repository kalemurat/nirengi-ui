import {
  ChangeDetectionStrategy,
  Component,
  contentChild,
  input,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { TabLabelDirective } from './tab-label.directive';

/**
 * Tab öğesi component'i.
 * `nui-tabs` component'i içinde kullanılır.
 * İçeriği `ng-content` ile alır ve path-template olarak parent'a sunar.
 *
 * @example
 * <nui-tab label="Profil">
 *   <app-profile-settings />
 * </nui-tab>
 *
 * @example
 * <!-- Custom Template ile -->
 * <nui-tab>
 *   <ng-template nuiTabLabel>
 *      <nui-icon name="user" /> Profil
 *   </ng-template>
 *   İçerik...
 * </nui-tab>
 */
@Component({
  selector: 'nui-tab',
  standalone: true,
  templateUrl: './tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabComponent {
  /**
   * Tab başlığı.
   * Header kısmında görünecek metin.
   * Eğer `nuiTabLabel` directive kullanılırsa bu değer yok sayılır.
   */
  readonly label = input<string>();

  /**
   * Disabled durumu.
   * true ise tab seçilemez.
   *
   * @default false
   */
  readonly disabled = input<boolean>(false);

  /**
   * Custom label template'i.
   * `nuiTabLabel` directive ile içeriği yakalar.
   */
  readonly labelTemplate = contentChild(TabLabelDirective);

  /**
   * Tab içeriğini tutan template referansı.
   * Parent component (Tabs) tarafından içeriği render etmek için kullanılır.
   */
  readonly contentTemplate = viewChild.required(TemplateRef);
}
