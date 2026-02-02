import {
    Component,
    ChangeDetectionStrategy,
    input,
    output,
    signal,
    ElementRef,
    viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent, ButtonType } from '../button/button.component';
import { Size } from '../../common/enums/size.enum';
import { ColorVariant } from '../../common/enums/color-variant.enum';

/**
 * File Upload Component
 *
 * Supports drag & drop and click to upload.
 * Can handle single or multiple files.
 * Provides a remove button for each file and a 'clear all' option.
 *
 * @example
 * <nui-file-upload
 *   [multiple]="true"
 *   accept=".png,.jpg"
 *   (fileSelected)="onFilesSelected($event)"
 * />
 */
@Component({
  selector: 'nui-file-upload',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileUploadComponent {
  protected readonly Size = Size;
  protected readonly ColorVariant = ColorVariant;
  protected readonly ButtonType = ButtonType;

  /**
   * Label for the upload button.
   * Default: 'Upload'
   */
  readonly uploadLabel = input<string>('Upload');

  /**
   * Label for the remove all button.
   * Default: 'Remove all'
   */
  readonly removeAllLabel = input<string>('Remove all');

  /**
   * Text for the clickable part of the drop zone.
   * Default: 'Click to upload file'
   */
  readonly clickLabel = input<string>('Click to upload file');

  /**
   * Text for the drag and drop part of the drop zone.
   * Default: 'or drag and drop'
   */
  readonly dragDropLabel = input<string>('or drag and drop');


  /**
   * Whether to allow multiple file selection.
   * Default: false
   */
  readonly multiple = input<boolean>(false);

  /**
   * Accepted file types (e.g. '.png, .jpg, image/*').
   */
  readonly accept = input<string>('');

  /**
   * Whether the component is disabled.
   */
  readonly disabled = input<boolean>(false);

  /**
   * Emitted when files are selected or dropped.
   * Returns an array of File objects.
   */
  readonly fileSelected = output<File[]>();

  /**
   * Emitted when files are about to be uploaded.
   * Paylod: Array of files to upload.
   */
  readonly upload = output<File[]>();

  /**
   * Emitted when a single file is removed.
   * Payload: The removed File object.
   */
  readonly fileDeleted = output<File>();

  /**
   * Emitted when all files are cleared.
   * Payload: Array of cleared File objects.
   */
  readonly filesCleared = output<File[]>();

  /**
   * Deprecated: Use fileDeleted or filesCleared instead if possible,
   * but kept for compatibility or different use case (remaining files).
   * Emitted when a file is removed (returns remaining files).
   */
  readonly fileRemoved = output<File[]>();

  /**
   * Internal reference to the file input element
   */
  readonly fileInput = viewChild.required<ElementRef<HTMLInputElement>>('fileInput');

  /**
   * Signal to track selected files
   */
  readonly files = signal<File[]>([]);

  /**
   * Signal to track drag over state
   */
  readonly isDragOver = signal<boolean>(false);

  /**
   * Handles drag over event
   */
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (!this.disabled()) {
      this.isDragOver.set(true);
    }
  }

  /**
   * Handles drag leave event
   */
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);
  }

  /**
   * Handles drop event
   */
  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);

    if (this.disabled()) {
      return;
    }

    const droppedFiles = event.dataTransfer?.files;
    if (droppedFiles && droppedFiles.length > 0) {
      this.handleFiles(droppedFiles);
    }
  }

  /**
   * Handles file input change event
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFiles(input.files);
    }
  }

  /**
   * Processes selected files, updates signals and emits events
   */
  private handleFiles(fileList: FileList): void {
    const newFiles = Array.from(fileList);

    if (!this.multiple()) {
      // If not multiple, replace existing file
      this.files.set([newFiles[0]]);
    } else {
      // If multiple, append or replace? Usually append in UI, but standard input replaces.
      // Let's implement append logic for better UX in typical drag-drop scenarios,
      // but ensure we don't duplicate if needed. For now, let's append.
      // Actually, standard input behavior is new selection replaces old unless we implement a custom store.
      // Let's implement append for drag & drop and "add more" feel.
      this.files.update((current) => [...current, ...newFiles]);
    }

    this.fileSelected.emit(this.files());

    // Reset input value to allow selecting the same file again if needed (and if we cleared it)
    // But since we are showing the list, usually we keep it.
    // However, if we remove a file, we can't easily remove it from the input.files FileList (it's read-only).
    // So usually we use the input just as a trigger and manage state in `files` signal.
    // To allow re-selecting the same file after removing it, we should clear value.
    this.fileInput().nativeElement.value = '';
  }

  /**
   * Removes a specific file from the list
   */
  removeFile(fileToRemove: File, event: Event): void {
    event.stopPropagation();
    if (this.disabled()) return;

    this.files.update((params) => params.filter((f) => f !== fileToRemove));

    // Emit the removed file
    this.fileDeleted.emit(fileToRemove);

    // Emit remaining files
    this.fileRemoved.emit(this.files());
    this.fileSelected.emit(this.files());
  }

  /**
   * Clears all files
   */
  clearFiles(): void {
    if (this.disabled()) return;

    const filesToClear = this.files();
    this.files.set([]);

    this.filesCleared.emit(filesToClear);
    this.fileRemoved.emit([]);
    this.fileSelected.emit([]);
  }

  /**
   * Triggers the upload event
   */
  onUpload(): void {
    if (this.disabled() || this.files().length === 0) return;
    this.upload.emit(this.files());
  }

  /**
   * Formats file size to human readable string
   */
  formatSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
