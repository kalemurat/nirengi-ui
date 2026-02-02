export interface FileUploadEvent {
  originalEvent: Event;
  files: File[];
}

export type FileUploadVariant = 'default' | 'compact' | 'basic';
