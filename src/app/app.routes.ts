import { Routes } from '@angular/router';
import { HeadingPageComponent } from './pages/heading-page/heading-page.component';
import { ButtonPageComponent } from './pages/button-page/button-page.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'heading',
    pathMatch: 'full'
  },
  {
    path: 'heading',
    component: HeadingPageComponent
  },
  {
    path: 'button',
    component: ButtonPageComponent
  }
];
