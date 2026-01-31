import { Directive, inject, TemplateRef } from '@angular/core';

/**
 * Tab etiketi için directive.
 * Tab başlığında özel template (ikon, resim vb.) kullanmak için kullanılır.
 *
 * @example
 * <nui-tab>
 *   <ng-template nuiTabLabel>
 *     <nui-icon name="user" />
 *     <span>Profil</span>
 *   </ng-template>
 *   İçerik...
 * </nui-tab>
 */
@Directive({
  selector: '[nuiTabLabel]',
  standalone: true,
})
export class TabLabelDirective {
  /**
   * Template referansı.
   */
  readonly template = inject(TemplateRef);
}
