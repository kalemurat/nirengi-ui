/**
 * UI Kit bileşenleri için standart renk varyantları.
 * Semantik anlamları olan renk temaları sağlar.
 * 
 * @example
 * <nui-button [variant]="ColorVariant.Primary">Kaydet</nui-button>
 * <nui-alert [variant]="ColorVariant.Danger">Hata mesajı</nui-alert>
 */
export enum ColorVariant {
  /**
   * Birincil renk.
   * Kullanım: Ana aksiyonlar, primary CTA button'lar, marka rengi.
   */
  Primary = 'primary',

  /**
   * İkincil renk.
   * Kullanım: Secondary aksiyonlar, alternatif button'lar.
   */
  Secondary = 'secondary',

  /**
   * Başarı rengi.
   * Kullanım: Başarılı işlem mesajları, onay durumları, pozitif feedback.
   */
  Success = 'success',

  /**
   * Uyarı rengi.
   * Kullanım: Dikkat gerektiren durumlar, uyarı mesajları.
   */
  Warning = 'warning',

  /**
   * Tehlike/Hata rengi.
   * Kullanım: Hata mesajları, silme aksiyonları, kritik uyarılar.
   */
  Danger = 'danger',

  /**
   * Bilgi rengi.
   * Kullanım: Bilgilendirme mesajları, ipuçları, yardımcı içerik.
   */
  Info = 'info',

  /**
   * Nötr/Gri renk.
   * Kullanım: İptal button'ları, devre dışı durumlar, arka plan.
   */
  Neutral = 'neutral'
}
