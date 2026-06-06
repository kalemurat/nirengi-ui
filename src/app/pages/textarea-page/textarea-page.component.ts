import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  TextareaComponent,
  Size,
  ColorVariant,
} from '../../../../projects/nirengi-ui-kit/src/public-api';

@Component({
  selector: 'app-textarea-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TextareaComponent],
  templateUrl: './textarea-page.component.html',
  styleUrl: './textarea-page.component.scss',
})
export class TextareaPageComponent {
  protected readonly sizes = Object.values(Size);

  protected readonly ColorVariant = ColorVariant;

  protected readonly demoControl = new FormControl('');
}
