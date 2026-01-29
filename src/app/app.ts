import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

/**
 * Ana uygulama component'i.
 * UI Kit component'lerini showcase eden menü sistemi.
 * 
 * ## Özellikler
 * - ✅ Signal tabanlı state yönetimi
 * - ✅ Routing ile sayfa geçişleri
 * - ✅ Responsive sidebar menü
 * - ✅ Kategorize edilmiş component listesi
 * 
 * @see https://v20.angular.dev/guide/routing
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  
}
