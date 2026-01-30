import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent, ButtonType, Size, ColorVariant } from 'nirengi-ui-kit';

/**
 * Button Component Showcase Sayfası.
 * Button componentinin tüm varyasyonlarını sergiler.
 */
@Component({
  selector: 'app-button-page',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './button-page.html',
  styleUrl: './button-page.scss',
})
export class ButtonPageComponent {
  /** Component enum referansları */
  protected readonly ButtonType = ButtonType;
  protected readonly Size = Size;
  protected readonly ColorVariant = ColorVariant;

  /**
   * Button tipleri listesi.
   */
  protected readonly buttonTypes = signal<ButtonType[]>([
    ButtonType.Solid,
    ButtonType.Outline,
    ButtonType.Ghost,
    ButtonType.Soft,
  ]);

  /**
   * Button boyutları listesi.
   */
  protected readonly buttonSizes = signal<Size[]>([
    Size.XSmall,
    Size.Small,
    Size.Medium,
    Size.Large,
    Size.XLarge,
  ]);

  /**
   * Renk varyasyonları listesi.
   */
  protected readonly buttonVariants = signal<ColorVariant[]>([
    ColorVariant.Primary,
    ColorVariant.Secondary,
    ColorVariant.Success,
    ColorVariant.Warning,
    ColorVariant.Danger,
    ColorVariant.Info,
    ColorVariant.Neutral,
  ]);

  /**
   * Button tıklama olayı.
   */
  handleButtonClick(): void {
    console.log('Button clicked!');
  }
}
