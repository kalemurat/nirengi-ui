import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'showcase/button',
    pathMatch: 'full',
  },
  {
    path: 'showcase/:id',
    loadComponent: () =>
      import('./components/showcase-layout/showcase-layout.component').then(
        (m) => m.ShowcaseLayoutComponent
      ),
  },
  {
    path: 'heading',
    loadComponent: () =>
      import('./pages/heading-page/heading-page.component').then((m) => m.HeadingPageComponent),
  },
  {
    path: 'button',
    loadComponent: () =>
      import('./pages/button-page/button-page.component').then((m) => m.ButtonPageComponent),
  },
  {
    path: 'icon',
    loadComponent: () =>
      import('./pages/icon-page/icon-page.component').then((m) => m.IconPageComponent),
  },
  {
    path: 'badge',
    loadComponent: () =>
      import('./pages/badge-page/badge-page.component').then((m) => m.BadgePageComponent),
  },
  {
    path: 'textbox',
    loadComponent: () =>
      import('./pages/textbox-page/textbox-page.component').then((m) => m.TextboxPageComponent),
  },
  {
    path: 'textarea',
    loadComponent: () =>
      import('./pages/textarea-page/textarea-page.component').then((m) => m.TextareaPageComponent),
  },
  {
    path: 'checkbox',
    loadComponent: () =>
      import('./pages/checkbox-page/checkbox-page.component').then((m) => m.CheckboxPageComponent),
  },
  {
    path: 'paragraph',
    loadComponent: () =>
      import('./pages/paragraph-page/paragraph-page.component').then(
        (m) => m.ParagraphPageComponent
      ),
  },
  {
    path: 'select',
    loadComponent: () =>
      import('./pages/select-page/select-page.component').then((m) => m.SelectPageComponent),
  },
  {
    path: 'demo',
    loadComponent: () =>
      import('./pages/demo-page/demo-page.component').then((m) => m.DemoPageComponent),
  },
];
