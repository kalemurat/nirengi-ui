/**
 * UI Kit bileşenleri için standart boyut değerleri.
 * Tüm componentlerde tutarlı boyutlandırma sağlamak için kullanılır.
 * 
 * @example
 * <nui-button [size]="Size.Medium">Kaydet</nui-button>
 * <nui-input [size]="Size.Large"></nui-input>
 */
export enum Size {
  /**
   * Ekstra küçük boyut.
   * Kullanım: Çok kompakt alanlar, icon button'lar, chip'ler.
   */
  XSmall = 'xs',

  /**
   * Küçük boyut.
   * Kullanım: Kompakt listeler, secondary aksiyonlar, badge'ler.
   */
  Small = 'sm',

  /**
   * Orta boyut (varsayılan).
   * Kullanım: Standart form elementleri, button'lar, çoğu component.
   */
  Medium = 'md',

  /**
   * Büyük boyut.
   * Kullanım: Vurgulanan aksiyonlar, hero section'lar.
   */
  Large = 'lg',

  /**
   * Ekstra büyük boyut.
   * Kullanım: Landing page'ler, özel vurgular, hero button'lar.
   */
  XLarge = 'xl'
}
