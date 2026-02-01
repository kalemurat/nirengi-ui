import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  TextareaComponent,
  Size,
  ColorVariant,
} from '../../../../projects/nirengi-ui-kit/src/public-api';

/**
 * Textarea component showcase sayfası.
 * Textarea componentinin tüm özelliklerini ve varyasyonlarını gösterir.
 */
@Component({
  selector: 'app-textarea-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TextareaComponent],
  templateUrl: './textarea-page.component.html',
  styleUrl: './textarea-page.component.scss',
})
export class TextareaPageComponent {
  /** Size enum referansı */
  protected readonly sizes = Object.values(Size);

  /** ColorVariant enum referansı */
  protected readonly ColorVariant = ColorVariant;

  /** Demo form control */
  protected readonly demoControl = new FormControl('');
}
