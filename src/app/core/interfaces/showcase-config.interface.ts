/**
 * Showcase Configuration Interfaces.
 * Storybook-style UI Kit showcase sistemi için JSON-driven type-safe konfigürasyon arayüzleri.
 *
 * Bu interface'ler component showcase'lerinin tamamen JSON ile yönetilmesini sağlar:
 * - Property tanımları (enum, boolean, string, vs.)
 * - Event tanımları
 * - Component metadata
 * - Menu yapısı
 *
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

/**
 * Property tipi enum.
 * Her property'nin hangi UI kontrolü ile düzenleneceğini belirler.
 */
export type PropertyType = 'string' | 'number' | 'boolean' | 'enum' | 'array' | 'contentProjection';

/**
 * Enum property için seçenek tanımı.
 */
export interface PropertyOption {
  /** Kullanıcıya gösterilecek label */
  label: string;

  /** Gerçek değer (component input'una gönderilecek) */
  value: any;
}

/**
 * Component property konfigürasyonu.
 * Her property'nin UI'da nasıl gösterileceğini ve düzenleneceğini tanımlar.
 */
export interface PropertyConfig {
  /** Property adı (component @Input() ile eşleşmeli) */
  name: string;

  /** Property tipi */
  type: PropertyType;

  /** Varsayılan değer */
  defaultValue: any;

  /** UI'da gösterilecek label */
  label: string;

  /** Property açıklaması (opsiyonel) */
  description?: string;

  /** Enum ise seçenekler (type='enum' için zorunlu) */
  options?: PropertyOption[];

  /** Content projection ise kullanım açıklaması */
  contentProjectionHint?: string;

  /** Read-only property mi? (Properties Panel'de değiştirilemez) */
  readOnly?: boolean;

  /** Properties Panel'de gizlensin mi? */
  hideInPanel?: boolean;
}

/**
 * Component event konfigürasyonu.
 */
export interface EventConfig {
  /** Event adı (component @Output() ile eşleşmeli) */
  name: string;

  /** UI'da gösterilecek label */
  label: string;

  /** Event payload tipi açıklaması (opsiyonel) */
  payloadDescription?: string;
}

/**
 * Component showcase örneği.
 * Belirli property kombinasyonları ile örnek kullanımlar.
 */
export interface ShowcaseExample {
  /** Örnek başlığı */
  title: string;

  /** Örnek açıklaması */
  description: string;

  /** Property değerleri map */
  propertyValues: Record<string, any>;
}

/**
 * Showcase edilecek component'in tam konfigürasyonu.
 * Bir component'in tüm metadata, property ve event tanımlarını içerir.
 */
export interface ComponentShowcaseConfig {
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
  properties: PropertyConfig[];

  /** Event tanımları */
  events: EventConfig[];

  /** Kullanım örnekleri (opsiyonel) */
  examples?: ShowcaseExample[];
}

/**
 * Menü kategorisi.
 */
export interface MenuCategory {
  /** Kategori adı */
  name: string;

  /** Kategorideki component'ler */
  items: MenuItemConfig[];
}

/**
 * Menü item konfigürasyonu.
 */
export interface MenuItemConfig {
  /** Component ID */
  id: string;

  /** Görünen label */
  label: string;

  /** Kısa açıklama */
  description: string;
}

/**
 * Ana menü konfigürasyonu.
 */
export interface MenuConfig {
  /** Kategoriler listesi */
  categories: MenuCategory[];
}

/**
 * Event log kaydı.
 * Event console'da gösterilecek log entry.
 */
export interface EventLog {
  /** Unique log ID */
  id: string;

  /** Log zamanı */
  timestamp: Date;

  /** Component ID */
  componentId: string;

  /** Event adı */
  eventName: string;

  /** Event payload */
  payload: any;
}
