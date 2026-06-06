import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TextboxComponent, Size } from '../../../../projects/nirengi-ui-kit/src/public-api';

@Component({
  selector: 'app-textbox-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TextboxComponent],
  templateUrl: './textbox-page.component.html',
  styleUrl: './textbox-page.component.scss',
})
export class TextboxPageComponent {
  protected readonly sizes = Object.values(Size);

  protected readonly demoControl = new FormControl('');
}
