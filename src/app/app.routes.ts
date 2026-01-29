import { Routes } from '@angular/router';
import { HeadingPageComponent } from './pages/heading-page/heading-page.component';
import { ButtonPageComponent } from './pages/button-page/button-page.component';
import { ShowcaseLayoutComponent } from './components/showcase-layout/showcase-layout.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'heading',
    pathMatch: 'full'
  },
  // Yeni Storybook-style showcase sayfası
  {
    path: 'showcase/:id',
    component: ShowcaseLayoutComponent
  },
  // Mevcut route'lar (korunuyor)
  {
    path: 'heading',
    component: HeadingPageComponent
  },
  {
    path: 'button',
    component: ButtonPageComponent
  },
  {
    path: 'icon',
    loadComponent: () => import('./pages/icon-page/icon-page.component').then(m => m.IconPageComponent)
  },
  {
    path: 'badge',
    loadComponent: () => import('./pages/badge-page/badge-page.component').then(m => m.BadgePageComponent)
  },
  {
    path: 'textbox',
    loadComponent: () => import('./pages/textbox-page/textbox-page.component').then(m => m.TextboxPageComponent)
  },
  {
    path: 'textarea',
    loadComponent: () => import('./pages/textarea-page/textarea-page.component').then(m => m.TextareaPageComponent)
  },
  {
    path: 'checkbox',
    loadComponent: () => import('./pages/checkbox-page/checkbox-page.component').then(m => m.CheckboxPageComponent)
  },
  {
    path: 'paragraph',
    loadComponent: () => import('./pages/paragraph-page/paragraph-page.component').then(m => m.ParagraphPageComponent)
  },
  {
    path: 'select',
    loadComponent: () => import('./pages/select-page/select-page.component').then(m => m.SelectPageComponent)
  }
];
