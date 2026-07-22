import { ThemeService } from './theme.service';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';

describe('ThemeService', () => {
  const mediaQuery = (matches: boolean): MediaQueryList =>
    ({
      matches,
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => true,
    }) as MediaQueryList;

  const injectService = (): ThemeService => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), ThemeService],
    });
    return TestBed.inject(ThemeService);
  };

  beforeEach(() => {
    TestBed.resetTestingModule();
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    // jsdom does not implement matchMedia, so provide a light-preference default
    // that individual tests can override.
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => mediaQuery(false))
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should create', () => {
    const service = injectService();

    expect(service).toBeTruthy();
  });

  it('should initialize from saved dark theme and apply dark class', () => {
    localStorage.setItem('theme', 'dark');

    const service = injectService();
    TestBed.tick();

    expect(service.theme()).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('should initialize from saved light theme and remove dark class', () => {
    localStorage.setItem('theme', 'light');
    document.documentElement.classList.add('dark');

    const service = injectService();
    TestBed.tick();

    expect(service.theme()).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('should initialize from system preference when no saved theme', () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue(mediaQuery(false));

    const service = injectService();
    TestBed.tick();

    expect(service.theme()).toBe('light');
  });

  it('should initialize to dark when the system prefers a dark colour scheme', () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue(mediaQuery(true));

    const service = injectService();
    TestBed.tick();

    expect(service.theme()).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('should toggle from light to dark and persist localStorage value', () => {
    localStorage.setItem('theme', 'light');
    const service = injectService();

    service.toggleTheme();
    TestBed.tick();

    expect(service.theme()).toBe('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('should toggle from dark to light and update html class', () => {
    localStorage.setItem('theme', 'dark');
    const service = injectService();
    TestBed.tick();

    service.toggleTheme();
    TestBed.tick();

    expect(service.theme()).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});
