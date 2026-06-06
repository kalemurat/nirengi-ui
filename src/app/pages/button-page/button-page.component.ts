import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent, ButtonType, Size, ColorVariant } from 'nirengi-ui-kit';

@Component({
  selector: 'app-button-page',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './button-page.html',
  styleUrl: './button-page.scss',
})
export class ButtonPageComponent {
  protected readonly ButtonType = ButtonType;
  protected readonly Size = Size;
  protected readonly ColorVariant = ColorVariant;

  protected readonly buttonTypes = signal<ButtonType[]>([
    ButtonType.Solid,
    ButtonType.Outline,
    ButtonType.Ghost,
    ButtonType.Soft,
  ]);

  protected readonly buttonSizes = signal<Size[]>([
    Size.XSmall,
    Size.Small,
    Size.Medium,
    Size.Large,
    Size.XLarge,
  ]);

  protected readonly buttonVariants = signal<ColorVariant[]>([
    ColorVariant.Primary,
    ColorVariant.Secondary,
    ColorVariant.Success,
    ColorVariant.Warning,
    ColorVariant.Danger,
    ColorVariant.Info,
    ColorVariant.Neutral,
  ]);

  handleButtonClick(): void {
    console.log('Button clicked!');
  }
}
