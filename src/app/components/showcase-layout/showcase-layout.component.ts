import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuPanelComponent } from './menu-panel/menu-panel.component';
import { ComponentRendererComponent } from './component-renderer/component-renderer.component';
import { PropertiesPanelComponent } from './properties-panel/properties-panel.component';
import { EventConsoleComponent } from './event-console/event-console.component';
import { PropertyStateService } from '../../core/services/property-state.service';
import { EventLoggerService } from '../../core/services/event-logger.service';
import { ComponentRegistryService } from '../../core/services/component-registry.service';

// JSON configs
import buttonConfig from '../../configs/button.showcase.json';
import selectConfig from '../../configs/select.showcase.json';
import headingConfig from '../../configs/heading.showcase.json';
import paragraphConfig from '../../configs/paragraph.showcase.json';
import iconConfig from '../../configs/icon.showcase.json';
import badgeConfig from '../../configs/badge.showcase.json';
import textboxConfig from '../../configs/textbox.showcase.json';
import textareaConfig from '../../configs/textarea.showcase.json';
import checkboxConfig from '../../configs/checkbox.showcase.json';
import radioConfig from '../../configs/radio.showcase.json';
import breadcrumbConfig from '../../configs/breadcrumb.showcase.json';
import listConfig from '../../configs/list.showcase.json';
import tableConfig from '../../configs/table.showcase.json';
import accordionConfig from '../../configs/accordion.showcase.json';
import datepickerConfig from '../../configs/datepicker.showcase.json';
import toastConfig from '../../configs/toast.showcase.json';
import modalConfig from '../../configs/modal.showcase.json';
import tabsConfig from '../../configs/tabs.showcase.json';
import tooltipConfig from '../../configs/tooltip.showcase.json';
import switchConfig from '../../configs/switch.showcase.json';
import popoverConfig from '../../configs/popover.showcase.json';

// Component imports
import {
    ButtonComponent,
    SelectComponent,
    HeadingComponent,
    ParagraphComponent,
    IconComponent,
    BadgeComponent,
    TextboxComponent,
    TextareaComponent,
    CheckboxComponent,
    RadioComponent,
    BreadcrumbComponent,
    ListComponent,
    TableComponent,
    AccordionComponent,
    DatepickerComponent,
    ToastDemoComponent,
    ModalDemoComponent,
    TabsDemoComponent,
    TooltipDemoComponent,
    SwitchComponent,
    PopoverDemoComponent,
} from 'nirengi-ui-kit';

/**
 * Showcase Layout Component.
 * Component showcase için 3-panel layout yapısı.
 *
 * ## Layout Yapısı
 * - Sol: Menu Panel (280px)
 * - Orta: Component Renderer + Event Console (flex-grow)
 * - Sağ: Properties Panel (380px)
 *
 * ## Sorumluluklar
 * - Component-level servis provide etme
 * - Component registry'yi initialize etme
 * - JSON config'leri load etme
 * - Layout orchestration
 *
 * ## Özellikler
 * - ✅ CSS Grid ile 3-panel layout
 * - ✅ Component-level DI (memory cleanup)
 * - ✅ Responsive design
 * - ✅ OnPush change detection
 *
 * @see {@link PropertyStateService}
 * @see {@link EventLoggerService}
 * @see {@link ComponentRegistryService}
 */
@Component({
  selector: 'app-showcase-layout',
  standalone: true,
  imports: [
    CommonModule,
    MenuPanelComponent,
    ComponentRendererComponent,
    PropertiesPanelComponent,
    EventConsoleComponent,
  ],
  templateUrl: './showcase-layout.component.html',
  styleUrl: './showcase-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // Component-level servisler - sayfa terk edildiğinde hafızadan temizlenir
  providers: [PropertyStateService, EventLoggerService, ComponentRegistryService],
})
export class ShowcaseLayoutComponent {
  private readonly registry = inject(ComponentRegistryService);

  constructor() {
    this.initializeRegistry();
    this.registry.registerConfig(accordionConfig as any);
  }

  private initializeRegistry(): void {
    // Button Component
    this.registry.registerComponent(buttonConfig as any, () => Promise.resolve(ButtonComponent));

    // Select Component
    this.registry.registerComponent(selectConfig as any, () => Promise.resolve(SelectComponent));

    // Heading Component
    this.registry.registerComponent(headingConfig as any, () => Promise.resolve(HeadingComponent));

    // Paragraph Component
    this.registry.registerComponent(paragraphConfig as any, () =>
      Promise.resolve(ParagraphComponent)
    );

    // Icon Component
    this.registry.registerComponent(iconConfig as any, () => Promise.resolve(IconComponent));

    // Badge Component
    this.registry.registerComponent(badgeConfig as any, () => Promise.resolve(BadgeComponent));

    // Textbox Component
    this.registry.registerComponent(textboxConfig as any, () => Promise.resolve(TextboxComponent));

    // Textarea Component
    this.registry.registerComponent(textareaConfig as any, () =>
      Promise.resolve(TextareaComponent)
    );

    // Checkbox Component
    this.registry.registerComponent(checkboxConfig as any, () =>
      Promise.resolve(CheckboxComponent)
    );

    // Radio Component
    this.registry.registerComponent(radioConfig as any, () => Promise.resolve(RadioComponent));

    // Breadcrumb Component
    this.registry.registerComponent(breadcrumbConfig as any, () =>
      Promise.resolve(BreadcrumbComponent)
    );

    // List Component
    this.registry.registerComponent(listConfig as any, () => Promise.resolve(ListComponent));

    // Table Component
    this.registry.registerComponent(tableConfig as any, () => Promise.resolve(TableComponent));

    // Accordion Component
    this.registry.registerComponent(accordionConfig as any, () =>
      Promise.resolve(AccordionComponent)
    );

    // Datepicker Component
    this.registry.registerComponent(datepickerConfig as any, () =>
      Promise.resolve(DatepickerComponent)
    );

    // Toast Component
    this.registry.registerComponent(toastConfig as any, () => Promise.resolve(ToastDemoComponent));

    // Modal Component
    this.registry.registerComponent(modalConfig as any, () => Promise.resolve(ModalDemoComponent));

    // Tabs Component
    this.registry.registerComponent(tabsConfig as any, () => Promise.resolve(TabsDemoComponent));

    // Tooltip Component
    this.registry.registerComponent(tooltipConfig as any, () =>
      Promise.resolve(TooltipDemoComponent)
    );

    // Switch Component
    this.registry.registerComponent(switchConfig as any, () => Promise.resolve(SwitchComponent));

    // Popover Component
    this.registry.registerComponent(popoverConfig as any, () =>
      Promise.resolve(PopoverDemoComponent)
    );
  }
}
