import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IComponentShowcaseConfig } from '../../core/interfaces/showcase-config.interface';
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
import fileUploadConfig from '../../configs/file-upload.showcase.json';

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
  FileUploadComponent,
} from 'nirengi-ui-kit';

/**
 * Showcase Layout Component.
 * 3-panel layout structure for component showcase.
 *
 * ## Layout Structure
 * - Left: Menu Panel (280px)
 * - Center: Component Renderer + Event Console (flex-grow)
 * - Right: Properties Panel (380px)
 *
 * ## Responsibilities
 * - Providing component-level services
 * - Initializing the component registry
 * - Loading JSON configs
 * - Layout orchestration
 *
 * ## Features
 * - ✅ 3-panel layout with CSS Grid
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
  // Component-level services - cleaned up from memory when page is left
  providers: [PropertyStateService, EventLoggerService, ComponentRegistryService],
})
export class ShowcaseLayoutComponent {
  private readonly registry = inject(ComponentRegistryService);

  constructor() {
    this.initializeRegistry();
    this.registry.registerConfig(accordionConfig as IComponentShowcaseConfig);
  }

  private initializeRegistry(): void {
    // Button Component
    this.registry.registerComponent(buttonConfig as IComponentShowcaseConfig, () =>
      Promise.resolve(ButtonComponent)
    );

    // Select Component
    this.registry.registerComponent(selectConfig as IComponentShowcaseConfig, () =>
      Promise.resolve(SelectComponent)
    );

    // Heading Component
    this.registry.registerComponent(headingConfig as IComponentShowcaseConfig, () =>
      Promise.resolve(HeadingComponent)
    );

    // Paragraph Component
    this.registry.registerComponent(paragraphConfig as IComponentShowcaseConfig, () =>
      Promise.resolve(ParagraphComponent)
    );

    // Icon Component
    this.registry.registerComponent(iconConfig as IComponentShowcaseConfig, () =>
      Promise.resolve(IconComponent)
    );

    // Badge Component
    this.registry.registerComponent(badgeConfig as IComponentShowcaseConfig, () =>
      Promise.resolve(BadgeComponent)
    );

    // Textbox Component
    this.registry.registerComponent(textboxConfig as IComponentShowcaseConfig, () =>
      Promise.resolve(TextboxComponent)
    );

    // Textarea Component
    this.registry.registerComponent(textareaConfig as IComponentShowcaseConfig, () =>
      Promise.resolve(TextareaComponent)
    );

    // Checkbox Component
    this.registry.registerComponent(checkboxConfig as IComponentShowcaseConfig, () =>
      Promise.resolve(CheckboxComponent)
    );

    // Radio Component
    this.registry.registerComponent(radioConfig as IComponentShowcaseConfig, () =>
      Promise.resolve(RadioComponent)
    );

    // Breadcrumb Component
    this.registry.registerComponent(breadcrumbConfig as IComponentShowcaseConfig, () =>
      Promise.resolve(BreadcrumbComponent)
    );

    // List Component
    this.registry.registerComponent(listConfig as IComponentShowcaseConfig, () =>
      Promise.resolve(ListComponent)
    );

    // Table Component
    this.registry.registerComponent(tableConfig as IComponentShowcaseConfig, () =>
      Promise.resolve(TableComponent)
    );

    // Accordion Component
    this.registry.registerComponent(accordionConfig as IComponentShowcaseConfig, () =>
      Promise.resolve(AccordionComponent)
    );

    // Datepicker Component
    this.registry.registerComponent(datepickerConfig as IComponentShowcaseConfig, () =>
      Promise.resolve(DatepickerComponent)
    );

    // Toast Component
    this.registry.registerComponent(toastConfig as IComponentShowcaseConfig, () =>
      Promise.resolve(ToastDemoComponent)
    );

    // Modal Component
    this.registry.registerComponent(modalConfig as IComponentShowcaseConfig, () =>
      Promise.resolve(ModalDemoComponent)
    );

    // Tabs Component
    this.registry.registerComponent(tabsConfig as IComponentShowcaseConfig, () =>
      Promise.resolve(TabsDemoComponent)
    );

    // Tooltip Component
    this.registry.registerComponent(tooltipConfig as IComponentShowcaseConfig, () =>
      Promise.resolve(TooltipDemoComponent)
    );

    // Switch Component
    this.registry.registerComponent(switchConfig as IComponentShowcaseConfig, () =>
      Promise.resolve(SwitchComponent)
    );

    // Popover Component
    this.registry.registerComponent(popoverConfig as IComponentShowcaseConfig, () =>
      Promise.resolve(PopoverDemoComponent)
    );

    // File Upload Component
    this.registry.registerComponent(fileUploadConfig as IComponentShowcaseConfig, () =>
      Promise.resolve(FileUploadComponent)
    );
  }
}
