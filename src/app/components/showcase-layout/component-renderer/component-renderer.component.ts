import {
  Component,
  ViewChild,
  ViewContainerRef,
  inject,
  computed,
  effect,
  AfterViewInit,
  OnDestroy,
  DestroyRef,
  signal,
  ComponentRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ComponentRegistryService } from '../../../core/services/component-registry.service';
import { PropertyStateService } from '../../../core/services/property-state.service';
import { EventLoggerService } from '../../../core/services/event-logger.service';
import { ThemeService } from '../../../core/services/theme.service';
import { IconComponent, Size as SizeEnum } from 'nirengi-ui-kit';
import {
  IComponentShowcaseConfig,
  IPropertyConfig,
} from '../../../core/interfaces/showcase-config.interface';

@Component({
  selector: 'app-component-renderer',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './component-renderer.component.html',
  styleUrl: './component-renderer.component.scss',
})
export class ComponentRendererComponent implements AfterViewInit, OnDestroy {
  readonly Size = SizeEnum;

  @ViewChild('dynamicComponent', { read: ViewContainerRef })
  dynamicComponentContainer!: ViewContainerRef;

  protected readonly componentId = toSignal(
    inject(ActivatedRoute).params.pipe(map((params) => params['id'] || 'button')),
    { initialValue: 'button' }
  );

  protected readonly registry = inject(ComponentRegistryService);

  protected readonly currentConfig = computed(() => {
    const id = this.componentId();
    return this.registry.getConfig(id);
  });

  protected readonly themeService = inject(ThemeService);

  private readonly route = inject(ActivatedRoute);

  private readonly propertyState = inject(PropertyStateService);

  private readonly eventLogger = inject(EventLoggerService);

  private readonly destroyRef = inject(DestroyRef);

  private readonly currentComponentRef = signal<ComponentRef<unknown> | null>(null);

  private viewInitialized = signal(false);

  private readonly componentDestroy$ = new Subject<void>();

  constructor() {
    // Effect'i constructor'da oluştur (injection context içinde)
    effect(() => {
      // ViewChild henüz hazır değilse bekle
      if (!this.viewInitialized() || !this.dynamicComponentContainer) {
        return;
      }

      const id = this.componentId();
      const config = this.currentConfig();

      if (!config) {
        console.warn(`No config found for component: ${id}`);
        return;
      }

      // Render işlemini async olarak başlat
      this.renderComponent(id, config);
    });

    // Property değişikliklerini izle - effect'i injection context içinde çalıştır
    effect(() => {
      const componentRef = this.currentComponentRef();
      if (!componentRef) {
        return;
      }

      const properties = this.propertyState.allProperties();
      const config = this.currentConfig();

      if (!config) {
        return;
      }

      // Her property değişikliğinde ComponentRef.setInput() kullan
      config.properties.forEach((prop: IPropertyConfig) => {
        // contentProjection tipindeki property'leri skip et (runtime'da değiştirilemez)
        if (prop.type === 'contentProjection') {
          return;
        }

        const value = properties[prop.name];
        if (value !== undefined) {
          try {
            const inputName = this.mapPropertyName(prop.name, config.id);

            componentRef.setInput(inputName, value);
          } catch (error) {
            console.warn(`Failed to set input ${prop.name}:`, error);
          }
        }
      });

      // Change detection tetikle
      componentRef.changeDetectorRef.detectChanges();
    });
  }

  ngAfterViewInit(): void {
    // ViewChild hazır olduğunu işaretle
    this.viewInitialized.set(true);
  }

  ngOnDestroy(): void {
    this.componentDestroy$.next();
    this.componentDestroy$.complete();
    this.clearComponent();
  }

  private async renderComponent(id: string, config: IComponentShowcaseConfig): Promise<void> {
    // Önceki component'i temizle
    this.clearComponent();

    try {
      // Component'i yükle
      const component = await this.registry.getComponent(id);

      // Content projection için projectableNodes hazırla
      const projectableNodes = this.buildProjectableNodes(config);

      // Component instance oluştur (projectableNodes ile)
      const componentRef = this.dynamicComponentContainer.createComponent(component, {
        projectableNodes,
      });
      this.currentComponentRef.set(componentRef);

      // Property default değerlerini set et
      this.propertyState.resetToDefaults(config);

      // Property'leri bind et (setInput kullanarak - Angular 20 input() API uyumlu)
      this.bindProperties(componentRef, config);

      // Event'leri bind et
      this.bindEvents(componentRef.instance, config, id);

      // Change detection tetikle
      componentRef.changeDetectorRef.detectChanges();
    } catch (error) {
      console.error('Failed to render component:', error);
    }
  }

  private clearComponent(): void {
    // Event subscription'larını temizle
    this.componentDestroy$.next();

    if (this.dynamicComponentContainer) {
      this.dynamicComponentContainer.clear();
    }
    this.currentComponentRef.set(null);
  }

  /** Converts `contentProjection` property defaults to text nodes for ng-content slots. */
  private buildProjectableNodes(config: IComponentShowcaseConfig): Node[][] {
    const contentProjectionProps = config.properties.filter(
      (prop: IPropertyConfig) => prop.type === 'contentProjection'
    );

    if (contentProjectionProps.length === 0) {
      return [];
    }

    // Her content projection property için text node oluştur
    // Not: Şimdilik sadece tek ng-content slot desteği var
    const nodes: Node[] = [];

    contentProjectionProps.forEach((prop: IPropertyConfig) => {
      if (prop.defaultValue) {
        const textNode = document.createTextNode(String(prop.defaultValue));
        nodes.push(textNode);
      }
    });

    // Tek slot için node array'i dön (multi-slot desteği için genişletilebilir)
    return nodes.length > 0 ? [nodes] : [];
  }

  private bindProperties(
    componentRef: ComponentRef<unknown>,
    config: IComponentShowcaseConfig
  ): void {
    // İlk set - ComponentRef.setInput() kullan (Angular 20 input() API için)
    config.properties.forEach((prop: IPropertyConfig) => {
      // contentProjection tipindeki property'leri skip et (artık projectableNodes ile handled)
      if (prop.type === 'contentProjection') {
        return;
      }

      const value = this.propertyState.getProperty(prop.name);
      if (value !== undefined) {
        try {
          const inputName = this.mapPropertyName(prop.name, config.id);

          componentRef.setInput(inputName, value);
        } catch (error) {
          console.warn(`Failed to set initial input ${prop.name}:`, error);
        }
      }
    });

    // Change detection tetikle
    componentRef.changeDetectorRef.detectChanges();
  }

  /** Maps showcase property names to component input names when they differ (e.g. select `items` → `options`). */
  private mapPropertyName(propertyName: string, componentId: string): string {
    // Component-specific mappings
    if (componentId === 'select' && propertyName === 'items') {
      return 'options';
    }

    // Default mapping (globals if any)
    // return mapping[propertyName] || propertyName;

    return propertyName;
  }

  /** Subscribes to config-declared events and forwards them to EventLoggerService; subscriptions are cleaned up via `componentDestroy$` on each component swap. */
  private bindEvents(
    instance: unknown,
    config: IComponentShowcaseConfig,
    componentId: string
  ): void {
    config.events?.forEach((event) => {
      const instanceObj = instance as Record<string, unknown>;
      const eventEmitter = instanceObj[event.name];

      if (eventEmitter && typeof eventEmitter === 'object') {
        const subscribable = eventEmitter as {
          pipe?: (arg: unknown) => { subscribe: (cb: (p: unknown) => void) => void };
          subscribe?: (cb: (p: unknown) => void) => { unsubscribe: () => void };
        };

        if (subscribable.pipe && subscribable.subscribe) {
          subscribable.pipe(takeUntil(this.componentDestroy$)).subscribe((payload: unknown) => {
            this.eventLogger.logEvent(componentId, event.name, payload);
          });
        } else if (subscribable.subscribe) {
          const sub = subscribable.subscribe((payload: unknown) => {
            this.eventLogger.logEvent(componentId, event.name, payload);
          });
          this.componentDestroy$.pipe(take(1)).subscribe(() => sub.unsubscribe());
        }
      }
    });
  }
}
