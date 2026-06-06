/**
 * @example
 * ```json
 * {
 *   "id": "button",
 *   "name": "Button",
 *   "properties": [
 *     { "name": "variant", "type": "enum", "options": [...] }
 *   ]
 * }
 * ```
 */

export type PropertyType = 'string' | 'number' | 'boolean' | 'enum' | 'array' | 'contentProjection';

export interface IPropertyOption {
  /** Kullanıcıya gösterilecek label */
  label: string;

  /** Gerçek değer (component input'una gönderilecek) */
  value: unknown;
}

export interface IPropertyConfig {
  /** Property adı (component @Input() ile eşleşmeli) */
  name: string;

  /** Property tipi */
  type: PropertyType;

  /** Varsayılan değer */
  defaultValue: unknown;

  /** UI'da gösterilecek label */
  label: string;

  /** Property açıklaması (opsiyonel) */
  description?: string;

  /** Enum ise seçenekler (type='enum' için zorunlu) */
  options?: IPropertyOption[];

  /** Content projection ise kullanım açıklaması */
  contentProjectionHint?: string;

  /** Read-only property mi? (Properties Panel'de değiştirilemez) */
  readOnly?: boolean;

  /** Properties Panel'de gizlensin mi? */
  hideInPanel?: boolean;
}

export interface IEventConfig {
  /** Event adı (component @Output() ile eşleşmeli) */
  name: string;

  /** UI'da gösterilecek label */
  label: string;

  /** Event payload tipi açıklaması (opsiyonel) */
  payloadDescription?: string;
}

export interface IShowcaseExample {
  /** Örnek başlığı */
  title: string;

  /** Örnek açıklaması */
  description: string;

  /** Property değerleri map */
  propertyValues: Record<string, unknown>;
}

export interface IComponentShowcaseConfig {
  /** Unique component ID (route ile eşleşir) */
  id: string;

  /** Component görünen adı */
  name: string;

  /** Component açıklaması */
  description: string;

  /** Kategori (örn: 'Forms', 'Controls', 'Typography') */
  category: string;

  /** Component selector (örn: 'nirengi-button') */
  selector: string;

  /** Property tanımları */
  properties: IPropertyConfig[];

  /** Event tanımları */
  events?: IEventConfig[];

  /** Kullanım örnekleri (opsiyonel) */
  examples?: IShowcaseExample[];
}

export interface IMenuCategory {
  /** Kategori adı */
  name: string;

  /** Kategorideki component'ler */
  items: IMenuItemConfig[];
}

export interface IMenuItemConfig {
  /** Component ID */
  id: string;

  /** Görünen label */
  label: string;

  /** Kısa açıklama */
  description: string;
}

export interface IMenuConfig {
  /** Kategoriler listesi */
  categories: IMenuCategory[];
}

/** Event console'da gösterilecek log entry. */
export interface IEventLog {
  /** Unique log ID */
  id: string;

  /** Log zamanı */
  timestamp: Date;

  /** Component ID */
  componentId: string;

  /** Event adı */
  eventName: string;

  /** Event payload */
  payload: unknown;
}
