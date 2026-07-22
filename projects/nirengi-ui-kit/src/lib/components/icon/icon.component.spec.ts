import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconComponent } from './icon.component';
import { ALL_ICONS, IconName, IconNames } from './icon.types';

describe('IconComponent', () => {
  let fixture: ComponentFixture<IconComponent>;

  const svg = (): SVGSVGElement => fixture.nativeElement.querySelector('svg');
  const path = (): SVGPathElement => fixture.nativeElement.querySelector('svg path');

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

  describe('icon data set', () => {
    it('exposes the bundled RemixIcon set', () => {
      expect(IconNames.length).toBeGreaterThan(3000);
      expect(IconNames).toContain('home-line');
      expect(IconNames).toEqual(Object.keys(ALL_ICONS) as IconName[]);
    });

    it('stores every icon as SVG path data with no escapable characters', () => {
      const invalid = IconNames.filter((name) => !/^[A-Za-z0-9 .,\-]+$/.test(ALL_ICONS[name]));

      expect(invalid).toEqual([]);
    });
  });

  describe('rendering', () => {
    it('renders the svg and path in the SVG namespace', () => {
      expect(svg().namespaceURI).toBe('http://www.w3.org/2000/svg');
      expect(path().namespaceURI).toBe('http://www.w3.org/2000/svg');
    });

    it('renders the path data of the requested icon', () => {
      expect(path().getAttribute('d')).toBe(ALL_ICONS['home-line']);
    });

    it('swaps the path data when the name changes', () => {
      setInput('name', 'check-line');

      expect(path().getAttribute('d')).toBe(ALL_ICONS['check-line']);
    });

    it('uses a 24x24 viewBox and hides itself from assistive technology', () => {
      expect(svg().getAttribute('viewBox')).toBe('0 0 24 24');
      expect(svg().getAttribute('aria-hidden')).toBe('true');
      expect(svg().getAttribute('focusable')).toBe('false');
    });

    it('drops the d attribute for an unknown icon name', () => {
      setInput('name', 'not-a-real-icon');

      expect(path().hasAttribute('d')).toBeFalse();
    });
  });

  describe('color', () => {
    it('fills with currentColor by default', () => {
      expect(svg().getAttribute('fill')).toBe('currentColor');
    });

    it('fills with the provided color', () => {
      setInput('color', 'red');

      expect(svg().getAttribute('fill')).toBe('red');
    });
  });

  describe('size', () => {
    const expectSize = (value: number | string, expected: string) => {
      setInput('size', value);

      expect(svg().getAttribute('width')).toBe(expected);
      expect(svg().getAttribute('height')).toBe(expected);
    };

    it('defaults to 24', () => {
      expect(svg().getAttribute('width')).toBe('24');
      expect(svg().getAttribute('height')).toBe('24');
    });

    it('accepts a pixel number', () => expectSize(48, '48'));

    it('maps the size tokens', () => {
      expectSize('xs', '16');
      expectSize('sm', '20');
      expectSize('md', '24');
      expectSize('lg', '28');
      expectSize('xl', '32');
    });

    it('parses a numeric string', () => expectSize('40', '40'));

    it('falls back to 24 for an unparsable size', () => expectSize('huge', '24'));

    it('falls back to 24 for a non-positive numeric string', () => expectSize('0', '24'));
  });
});
