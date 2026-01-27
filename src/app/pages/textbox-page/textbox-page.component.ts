import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TextboxComponent, Size } from '../../../../projects/nirengi-ui-kit/src/public-api';

/**
 * Textbox component showcase sayfası.
 */
@Component({
  selector: 'app-textbox-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TextboxComponent],
  templateUrl: './textbox-page.component.html',
  styleUrl: './textbox-page.component.scss'
})
export class TextboxPageComponent {
  /** Size enum referansı */
  protected readonly sizes = Object.values(Size);
  
  /** Demo form control */
  protected readonly demoControl = new FormControl('');
}
