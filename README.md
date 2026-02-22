# Nirengi UI

Nirengi UI, Angular tabanlı yeniden kullanılabilir kullanıcı arayüzü (UI) bileşenleri ve örnek uygulamalar içeren bir bileşen kütüphanesidir.

## Öne Çıkanlar

- Modüler ve genişletilebilir mimari
- TypeScript ile yazılmış bileşenler
- Tema ve stiller için merkezi yapı
- Üretime hazır yönetim arayüzü

## İçindekiler

- [Projects](#projects)
- [Kurulum](#kurulum)
- [Kullanım](#kullanım)
- [Katkıda Bulunma](#katkıda-bulunma)
- [Lisans](#lisans)

## Projects

### nirengi-ui
Ana yönetim arayüzü uygulaması. Yönetim panelleri, raporlar ve işlem akışları içerir.

### nirengi-ui-kit
Nirengi UI için bağımsız, yeniden kullanılabilir Angular/TypeScript bileşen kütüphanesi. Tema, düzen ve üretkenlik bileşenleri içerir; Nirengi UI projesine ve diğer uygulamalara kolay entegrasyon sağlar.

**Özellikler:**
- Hızlı kurulum ve entegrasyon
- Temaya hazır, özelleştirilebilir bileşenler (Button, Card, Modal, Form bileşenleri vb.)
- Tam TypeScript desteği ve tip güvenliği
- Basit API ile kolay kullanım
- Standalone Components ile modern Angular mimarisi
- Tailwind CSS 3 entegrasyonu
- Tree-shaking optimizasyonu
- Dokümantasyon ve örnekler

**Kurulum:**

```bash
# npm
npm install nirengi-ui-kit

# yarn
yarn add nirengi-ui-kit
```

**Hızlı Başlangıç (Angular + TypeScript):**

```typescript
import { Component } from '@angular/core';
import { ButtonComponent } from 'nirengi-ui-kit/components/button/button.component';
import { Size } from 'nirengi-ui-kit/common/enums/size.enum';
import { ColorVariant } from 'nirengi-ui-kit/common/enums/color-variant.enum';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [ButtonComponent],
  template: `
    <div class="p-4">
      <h2>nirengi-ui-kit Örnek Kullanım</h2>
      <button nui-button 
              [size]="buttonSize" 
              [variant]="buttonVariant"
              (click)="handleClick()">
        Tıkla
      </button>
    </div>
  `
})
export class ExampleComponent {
  buttonSize = Size.Medium;
  buttonVariant = ColorVariant.Primary;
  
  handleClick() {
    alert('Tıklandı!');
  }
}
```

**Dokümantasyon & Demo:**
- GitHub: [https://github.com/kalemurat/nirengi-ui](https://github.com/kalemurat/nirengi-ui)
- Library Dokümantasyon: [projects/nirengi-ui-kit/README.md](projects/nirengi-ui-kit/README.md)

**Lisans:** MIT (daha fazla bilgi için [LICENSE](LICENSE) dosyasına bakın)

## Kurulum

Projeyi yerel olarak çalıştırmak için:

```bash
git clone https://github.com/kalemurat/nirengi-ui.git
cd nirengi-ui
# kurulum
npm install
# geliştirme sunucusu
npm start
```

Ana uygulamayı başlattıktan sonra tarayıcınızda `http://localhost:4200/` adresine gidin.

## Kullanım

### Ana Uygulama (nirengi-ui)

Geliştirme sunucusunu başlatmak için:

```bash
npm start
```

Projeyi build etmek için:

```bash
npm run build
```

Testleri çalıştırmak için:

```bash
npm test
```

### Library (nirengi-ui-kit)

Library'yi build etmek için:

```bash
ng build nirengi-ui-kit
```

Library testlerini çalıştırmak için:

```bash
ng test nirengi-ui-kit
```

Daha fazla bilgi için [nirengi-ui-kit README](projects/nirengi-ui-kit/README.md) dosyasına bakın.

## Katkıda Bulunma

Katkılar memnuniyetle kabul edilir. Lütfen aşağıdaki adımları izleyin:

1. Bu depoyu fork edin
2. Yeni bir feature branch oluşturun (`git checkout -b feature/harika-ozellik`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: harika özellik eklendi'`)
4. Branch'inizi push edin (`git push origin feature/harika-ozellik`)
5. Pull Request açın

Kodlama standartlarına uyun ve mümkünse testler ekleyin. Büyük değişiklikler için önce bir issue açarak tartışmaya başlayın.

## Destek

[![Sponsor](https://img.shields.io/badge/Sponsor-%E2%9D%A4-pink?logo=github)](https://github.com/sponsors/kalemurat)

Proje, bağış sistemi ile desteklenmeye açıktır; sponsorluk veya bağış yoluyla destek olmak isteyenleri memnuniyetle karşılıyoruz. Destek ve sponsorluk için yukarıdaki butonu kullanabilirsiniz.

## Lisans

Bu proje MIT Lisansı ile lisanslanmıştır. Daha fazla bilgi için [LICENSE](LICENSE) dosyasına bakın.
