import { Component, signal, computed, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CheckboxComponent } from 'nirengi-ui-kit';
import { Size } from 'nirengi-ui-kit';
import { ColorVariant } from 'nirengi-ui-kit';

@Component({
  selector: 'app-checkbox-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CheckboxComponent],
  templateUrl: './checkbox-page.component.html',
  styleUrl: './checkbox-page.component.scss',
})
export class CheckboxPageComponent {
  protected readonly Size = Size;
  protected readonly ColorVariant = ColorVariant;

  protected readonly sizes = signal<Size[]>([
    Size.XSmall,
    Size.Small,
    Size.Medium,
    Size.Large,
    Size.XLarge,
  ]);

  protected readonly variants = signal<ColorVariant[]>([
    ColorVariant.Primary,
    ColorVariant.Secondary,
    ColorVariant.Success,
    ColorVariant.Warning,
    ColorVariant.Danger,
    ColorVariant.Info,
    ColorVariant.Neutral,
  ]);

  // Form Controls
  protected basicControl = new FormControl(false);
  protected labelControl = new FormControl(true);
  protected descriptionControl = new FormControl(false);
  protected disabledControl = new FormControl({ value: true, disabled: true });
  protected disabledUncheckedControl = new FormControl({ value: false, disabled: true });
  protected requiredControl = new FormControl(false);

  // Indeterminate example controls
  protected option1Control = new FormControl(false);
  protected option2Control = new FormControl(true);
  protected option3Control = new FormControl(false);
  protected selectAllControl = new FormControl(false);

  // Real world example controls
  protected termsControl = new FormControl(false);
  protected newsletterControl = new FormControl(false);
  protected emailNotifControl = new FormControl(false);
  protected pushNotifControl = new FormControl(true);
  protected smsNotifControl = new FormControl(false);
  protected inStockControl = new FormControl(false);
  protected onSaleControl = new FormControl(true);
  protected freeShippingControl = new FormControl(false);

  protected selectAllIndeterminate = computed(() => {
    const option1 = this.option1Control.value ?? false;
    const option2 = this.option2Control.value ?? false;
    const option3 = this.option3Control.value ?? false;
    const checkedCount = [option1, option2, option3].filter(Boolean).length;
    return checkedCount > 0 && checkedCount < 3;
  });

  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    // Subscribe to child checkbox changes
    this.option1Control.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.updateSelectAll());
    this.option2Control.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.updateSelectAll());
    this.option3Control.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.updateSelectAll());

    // Subscribe to select all changes
    this.selectAllControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((checked) => {
        if (checked !== null) {
          this.option1Control.setValue(checked);
          this.option2Control.setValue(checked);
          this.option3Control.setValue(checked);
        }
      });
  }

  getSizeLabel(size: Size): string {
    const labels: Record<Size, string> = {
      [Size.XXSmall]: 'Extra Extra Small (2xs)',
      [Size.XSmall]: 'Extra Small (xs)',
      [Size.Small]: 'Small (sm)',
      [Size.Medium]: 'Medium (md)',
      [Size.Large]: 'Large (lg)',
      [Size.XLarge]: 'Extra Large (xl)',
    };
    return labels[size];
  }

  getVariantLabel(variant: ColorVariant): string {
    return variant.charAt(0).toUpperCase() + variant.slice(1);
  }

  private updateSelectAll(): void {
    const option1 = this.option1Control.value ?? false;
    const option2 = this.option2Control.value ?? false;
    const option3 = this.option3Control.value ?? false;
    const checkedCount = [option1, option2, option3].filter(Boolean).length;

    if (checkedCount === 3) {
      this.selectAllControl.setValue(true, { emitEvent: false });
    } else if (checkedCount === 0) {
      this.selectAllControl.setValue(false, { emitEvent: false });
    } else {
      this.selectAllControl.setValue(false, { emitEvent: false });
    }
  }
}
