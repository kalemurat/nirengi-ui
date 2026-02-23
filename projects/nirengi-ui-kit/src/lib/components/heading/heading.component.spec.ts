import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { HeadingComponent, HeadingLevel, HeadingAlign } from './heading.component';
import { Size } from '../../common/enums/size.enum';
import { ColorVariant } from '../../common/enums/color-variant.enum';

describe('HeadingComponent', () => {
  let component: HeadingComponent;
  let fixture: ComponentFixture<HeadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeadingComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(HeadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Auto Sizing (Level Based)', () => {
    it('should default to H2 level and Large size (auto)', () => {
      // Default level is H2. Size is undefined (auto).
      // Logic: H2 -> Size.Large
      // Computed classes should contain 'nui-heading--lg'

      const compiled = fixture.nativeElement as HTMLElement;
      const heading = compiled.querySelector('.nui-heading');
      expect(heading).toBeTruthy();
      expect(heading?.classList).toContain('nui-heading--lg');
      expect(heading?.tagName.toLowerCase()).toBe('h2');
    });

    it('should auto-size H1 to XLarge', () => {
      fixture.componentRef.setInput('level', HeadingLevel.H1);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const heading = compiled.querySelector('.nui-heading');
      expect(heading?.classList).toContain('nui-heading--xl');
      expect(heading?.tagName.toLowerCase()).toBe('h1');
    });

    it('should auto-size H6 to XSmall', () => {
      fixture.componentRef.setInput('level', HeadingLevel.H6);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const heading = compiled.querySelector('.nui-heading');
      expect(heading?.classList).toContain('nui-heading--xs');
      expect(heading?.tagName.toLowerCase()).toBe('h6');
    });

    it('should auto-size H3 to Medium', () => {
      fixture.componentRef.setInput('level', HeadingLevel.H3);
      fixture.detectChanges();

      const heading = (fixture.nativeElement as HTMLElement).querySelector('.nui-heading');
      expect(heading?.classList).toContain('nui-heading--md');
      expect(heading?.tagName.toLowerCase()).toBe('h3');
    });

    it('should auto-size H4 to Small', () => {
      fixture.componentRef.setInput('level', HeadingLevel.H4);
      fixture.detectChanges();

      const heading = (fixture.nativeElement as HTMLElement).querySelector('.nui-heading');
      expect(heading?.classList).toContain('nui-heading--sm');
      expect(heading?.tagName.toLowerCase()).toBe('h4');
    });

    it('should auto-size H5 to XSmall', () => {
      fixture.componentRef.setInput('level', HeadingLevel.H5);
      fixture.detectChanges();

      const heading = (fixture.nativeElement as HTMLElement).querySelector('.nui-heading');
      expect(heading?.classList).toContain('nui-heading--xs');
      expect(heading?.tagName.toLowerCase()).toBe('h5');
    });
  });

  describe('Manual Size Override', () => {
    it('should use explicit size input over level-based auto size', () => {
      // Set Level to H6 (default auto size would be XS)
      // Set Size to XLarge
      fixture.componentRef.setInput('level', HeadingLevel.H6);
      fixture.componentRef.setInput('size', Size.XLarge);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const heading = compiled.querySelector('.nui-heading');

      // Should be H6 tag but XL class
      expect(heading?.tagName.toLowerCase()).toBe('h6');
      expect(heading?.classList).toContain('nui-heading--xl');
      expect(heading?.classList).not.toContain('nui-heading--xs');
    });
  });

  describe('Other Inputs', () => {
    it('should apply correct variant class', () => {
      fixture.componentRef.setInput('variant', ColorVariant.Primary);
      fixture.detectChanges();
      const heading = (fixture.nativeElement as HTMLElement).querySelector('.nui-heading');
      expect(heading?.classList).toContain('nui-heading--primary');
    });

    it('should apply correct alignment class', () => {
      fixture.componentRef.setInput('align', HeadingAlign.Center);
      fixture.detectChanges();
      const heading = (fixture.nativeElement as HTMLElement).querySelector('.nui-heading');
      expect(heading?.classList).toContain('nui-heading--center');
    });

    it('should apply truncate class', () => {
      fixture.componentRef.setInput('truncate', true);
      fixture.detectChanges();
      const heading = (fixture.nativeElement as HTMLElement).querySelector('.nui-heading');
      expect(heading?.classList).toContain('nui-heading--truncate');
    });

    it('should apply line clamp class', () => {
      fixture.componentRef.setInput('lineClamp', 2);
      fixture.detectChanges();

      const heading = (fixture.nativeElement as HTMLElement).querySelector('.nui-heading');
      expect(heading?.classList).toContain('nui-heading--line-clamp-2');
    });

    it('should apply uppercase class', () => {
      fixture.componentRef.setInput('uppercase', true);
      fixture.detectChanges();

      const heading = (fixture.nativeElement as HTMLElement).querySelector('.nui-heading');
      expect(heading?.classList).toContain('nui-heading--uppercase');
    });

    it('should apply margin bottom class', () => {
      fixture.componentRef.setInput('marginBottom', true);
      fixture.detectChanges();

      const heading = (fixture.nativeElement as HTMLElement).querySelector('.nui-heading');
      expect(heading?.classList).toContain('nui-heading--margin-bottom');
    });
  });
});
