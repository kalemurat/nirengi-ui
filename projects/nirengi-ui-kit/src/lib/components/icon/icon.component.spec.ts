import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconComponent } from './icon.component';
import { loadNuiIconNames } from './icon-names.loader';

describe('IconComponent', () => {
  let fixture: ComponentFixture<IconComponent>;

  const glyph = (): HTMLElement => fixture.nativeElement.querySelector('i');

  const setInput = (name: string, value: unknown) => {
    fixture.componentRef.setInput(name, value);
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [IconComponent] }).compileComponents();

    fixture = TestBed.createComponent(IconComponent);
    fixture.componentRef.setInput('name', 'home-line');
    fixture.detectChanges();
  });

  describe('icon name list', () => {
    it('resolves the bundled name list lazily', async () => {
      const names = await loadNuiIconNames();

      expect(names.length).toBeGreaterThan(3000);
      expect(names).toContain('home-line');
    });

    it('lists only upstream kebab-case names', async () => {
      const names = await loadNuiIconNames();
      const invalid = names.filter((name) => !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name));

      expect(invalid).toEqual([]);
    });
  });

  describe('rendering', () => {
    it('applies the upstream CSS class alongside the BEM hook', () => {
      expect(glyph().classList).toContain('nui-icon');
      expect(glyph().classList).toContain('ri-home-line');
    });

    it('swaps the class when the name changes', () => {
      setInput('name', 'check-line');

      expect(glyph().classList).toContain('ri-check-line');
      expect(glyph().classList).not.toContain('ri-home-line');
    });

    it('hides itself from assistive technology', () => {
      expect(glyph().getAttribute('aria-hidden')).toBe('true');
    });

    it('renders an unmatched class for an unknown icon name rather than throwing', () => {
      setInput('name', 'not-a-real-icon');

      expect(glyph().classList).toContain('ri-not-a-real-icon');
    });
  });

  describe('color', () => {
    it('inherits the surrounding color by default', () => {
      expect(glyph().style.color).toBe('currentcolor');
    });

    it('applies the provided color', () => {
      setInput('color', 'red');

      expect(glyph().style.color).toBe('red');
    });
  });

  describe('size', () => {
    const expectSize = (value: number | string, expected: string) => {
      setInput('size', value);

      expect(glyph().style.fontSize).toBe(expected);
      expect(glyph().style.width).toBe(expected);
      expect(glyph().style.height).toBe(expected);
    };

    it('defaults to 24', () => {
      expect(glyph().style.fontSize).toBe('24px');
      expect(glyph().style.width).toBe('24px');
      expect(glyph().style.height).toBe('24px');
    });

    it('accepts a pixel number', () => expectSize(48, '48px'));

    it('maps the size tokens', () => {
      expectSize('xs', '16px');
      expectSize('sm', '20px');
      expectSize('md', '24px');
      expectSize('lg', '28px');
      expectSize('xl', '32px');
    });

    it('parses a numeric string', () => expectSize('40', '40px'));

    it('falls back to 24 for an unparsable size', () => expectSize('huge', '24px'));

    it('falls back to 24 for a non-positive numeric string', () => expectSize('0', '24px'));
  });
});
