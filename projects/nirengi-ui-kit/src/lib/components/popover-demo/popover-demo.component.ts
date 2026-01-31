import { Component, input, Type, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopoverDirective } from '../popover/popover.directive';
import { PopoverPosition } from '../popover/popover.types';
import { PopoverRef } from '../popover/popover.ref';
import { ButtonComponent } from '../button/button.component';
import { HeadingComponent, HeadingLevel } from '../heading/heading.component';
import { ParagraphComponent } from '../paragraph/paragraph.component';
import { Size } from '../../common/enums/size.enum';
import { ColorVariant } from '../../common/enums/color-variant.enum';
import { ButtonType } from '../button/button.component';

/**
 * Popover içinde gösterilecek örnek içerik.
 */
@Component({
  selector: 'nirengi-popover-example-content',
  standalone: true,
  imports: [CommonModule, HeadingComponent, ParagraphComponent, ButtonComponent],
  template: `
    <div class="w-64">
      <nui-heading [level]="HeadingLevel.H4" class="mb-2">
        {{ title() || 'Varsayılan Başlık' }}
      </nui-heading>
      <nui-paragraph class="mb-4 text-sm text-slate-600 dark:text-slate-300">
        Bu component dinamik olarak render edildi. 
        <br>
        <strong>Gelen Input:</strong> {{ customData() }}
      </nui-paragraph>
      <div class="flex justify-end gap-2">
        <nui-button 
            [size]="Size.XSmall" 
            [variant]="ColorVariant.Neutral" 
            [type]="ButtonType.Ghost"
            (clicked)="onAction('cancel')">
            İptal
        </nui-button>
        <nui-button 
            [size]="Size.XSmall" 
            [variant]="ColorVariant.Primary"
            (clicked)="onAction('cohk-guzel')">
            Onayla
        </nui-button>
      </div>
    </div>
  `
})
export class PopoverExampleContentComponent {
  /**
   * Parent'tan gelen input örneği
   */
  readonly title = input<string>();
  
  /**
   * Parent'tan gelen diğer input örneği
   */
  readonly customData = input<string>();

  protected readonly HeadingLevel = HeadingLevel;
  protected readonly Size = Size;
  protected readonly ColorVariant = ColorVariant;
  protected readonly ButtonType = ButtonType;

  // PopoverRef opsiyonel inject edilmeli çünkü component popover dışında da kullanılabilir (teorik olarak)
  private readonly popoverRef = inject(PopoverRef, { optional: true });

  onAction(action: 'cancel' | 'cohk-guzel'): void {
    if (this.popoverRef) {
        if (action === 'cohk-guzel') {
             this.popoverRef.emit('action', { type: 'success', message: 'Harika!' });
             this.popoverRef.close();
        } else {
             this.popoverRef.close();
        }
    } else {
        console.warn('PopoverRef bulunamadı');
    }
  }
}

/**
 * Popover showcase için demo wrapper component.
 */
@Component({
  selector: 'nirengi-popover-demo',
  standalone: true,
  imports: [CommonModule, PopoverDirective, ButtonComponent],
  template: `
    <div class="flex flex-col items-center justify-center p-12 bg-slate-50 dark:bg-slate-900 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 gap-4">
      <nui-button 
        [nirengiPopover]="contentComponent"
        [nirengiPopoverPosition]="position()" 
        [nirengiPopoverCloseOnOutsideClick]="closeOnOutsideClick()"
        [nirengiPopoverInputs]="demoInputs"
        (nirengiPopoverOutput)="handleEvent($event)"
        [variant]="ColorVariant.Primary">
        Popover'ı Aç
      </nui-button>

      <div *ngIf="lastEvent" class="text-sm p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 shadow-sm animate-fade-in">
        <span class="font-bold text-slate-700 dark:text-slate-300">Son Event:</span>
        <code class="ml-2 text-xs bg-slate-100 dark:bg-slate-900 p-1 rounded">{{ lastEvent | json }}</code>
      </div>
    </div>
  `
})
export class PopoverDemoComponent {
  /**
   * Showcase'den gelen pozisyon
   */
  readonly position = input<PopoverPosition>(PopoverPosition.Bottom);

  /**
   * Showcase'den gelen outside click ayarı
   */
  readonly closeOnOutsideClick = input<boolean>(true);

  /**
   * Gösterilecek içerik
   */
  readonly contentComponent: Type<any> = PopoverExampleContentComponent;

  /**
   * Componente geçilecek örnek inputlar
   */
  readonly demoInputs = {
      title: 'Dinamik Başlık',
      customData: 'Parent componentten gelen veri.'
  };
  
  lastEvent: any = null;

  protected readonly ColorVariant = ColorVariant;
  
  handleEvent(event: any): void {
      console.log('Popover Event:', event);
      this.lastEvent = event;
      
      // 3 saniye sonra mesajı temizle
      setTimeout(() => {
          this.lastEvent = null;
      }, 3000);
  }
}
