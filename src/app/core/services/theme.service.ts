import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  /**
   * Current theme signal (light | dark).
   * Initial value from localStorage or system preference.
   */
  readonly theme = signal<'light' | 'dark'>(this.getInitialTheme());

  constructor() {
    // Effect to apply theme to document element
    effect(() => {
      const currentTheme = this.theme();
      if (currentTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('theme', currentTheme);
    });
  }

  /**
   * Toggles between light and dark theme.
   */
  toggleTheme(): void {
    this.theme.update((current) => (current === 'light' ? 'dark' : 'light'));
  }

  /**
   * Gets initial theme preference.
   */
  private getInitialTheme(): 'light' | 'dark' {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
}
