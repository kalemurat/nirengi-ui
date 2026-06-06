export interface IFileUploadEvent {
  originalEvent: Event;
  files: File[];
}

export type FileUploadVariant = 'default' | 'compact' | 'basic';
