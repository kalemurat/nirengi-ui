import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TextboxComponent } from './textbox.component';
import { DEFAULT_TEXTBOX_INTL, ITextboxIntl, TEXTBOX_INTL } from './textbox-intl.token';

describe('textbox.component.ts', () => {
  let fixture: ComponentFixture<TextboxComponent>;
  let component: TextboxComponent;

  async function setup(intl?: Partial<ITextboxIntl>): Promise<void> {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [TextboxComponent],
      providers: [
        provideZonelessChangeDetection(),
        ...(intl ? [{ provide: TEXTBOX_INTL, useValue: intl }] : []),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TextboxComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('clearable', true);
    component.writeValue('hello');
    fixture.detectChanges();
  }

  function clearButton(): HTMLButtonElement | null {
    return fixture.nativeElement.querySelector('.nui-textbox__clear');
  }

  describe('value and state', () => {
    function inputEl(): HTMLInputElement {
      return fixture.nativeElement.querySelector('input');
    }

    it('should report typed text through the control value', async () => {
      await setup();
      const onChange = vi.fn();
      component.registerOnChange(onChange);
      inputEl().value = 'typed';
      inputEl().dispatchEvent(new Event('input'));
      expect(component.value()).toBe('typed');
      expect(onChange).toHaveBeenCalledWith('typed');
    });

    it('should apply the size and variant classes to the wrapper and input', async () => {
      await setup();
      fixture.componentRef.setInput('size', 'lg');
      fixture.componentRef.setInput('variant', 'danger');
      fixture.detectChanges();
      expect(
        fixture.nativeElement.querySelector('.nui-textbox--lg.nui-textbox--danger')
      ).not.toBeNull();
      expect(inputEl().classList).toContain('nui-textbox__input--lg');
    });

    it('should scale the clear icon with the size', async () => {
      await setup();
      const sizes = { '2xs': 18, xs: 14, sm: 16, md: 18, lg: 20, xl: 24 } as const;
      for (const [size, px] of Object.entries(sizes)) {
        fixture.componentRef.setInput('size', size);
        fixture.detectChanges();
        expect((component as unknown as { iconSize(): number }).iconSize()).toBe(px);
      }
    });

    it('should hide the clear button and ignore clearValue when disabled or readonly', async () => {
      await setup();
      fixture.componentRef.setInput('readonly', true);
      fixture.detectChanges();
      expect(clearButton()).toBeNull();
      component.clearValue();
      expect(component.value()).toBe('hello');

      fixture.componentRef.setInput('readonly', false);
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      expect(clearButton()).toBeNull();
      component.clearValue();
      expect(component.value()).toBe('hello');
    });

    it('should take its value from the value input', async () => {
      await setup();
      fixture.componentRef.setInput('value', 'from input');
      fixture.detectChanges();
      expect(component.value()).toBe('from input');
    });
  });

  describe('reactive forms', () => {
    it('should read and write the value of a bound FormControl, including the clear button', async () => {
      @Component({
        imports: [TextboxComponent, ReactiveFormsModule],
        template: `<nui-textbox [clearable]="true" [formControl]="control" />`,
      })
      class HostComponent {
        readonly control = new FormControl('start');
      }

      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [HostComponent],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();
      const host = TestBed.createComponent(HostComponent);
      host.detectChanges();
      await host.whenStable();

      const input = host.nativeElement.querySelector('input') as HTMLInputElement;
      expect(input.value).toBe('start');

      input.value = 'next';
      input.dispatchEvent(new Event('input'));
      expect(host.componentInstance.control.value).toBe('next');

      host.detectChanges();
      (host.nativeElement.querySelector('.nui-textbox__clear') as HTMLButtonElement).click();
      expect(host.componentInstance.control.value).toBe('');
    });
  });

  describe('clear button', () => {
    it('should clear the value on click', async () => {
      await setup();
      clearButton()!.click();
      expect(component.value()).toBe('');
    });

    it('should not render when the textbox is empty', async () => {
      await setup();
      component.writeValue('');
      fixture.detectChanges();
      expect(clearButton()).toBeNull();
    });
  });

  describe('Built-in texts (TEXTBOX_INTL)', () => {
    it('should render the English default without a provider', async () => {
      await setup();
      expect(clearButton()!.getAttribute('aria-label')).toBe(DEFAULT_TEXTBOX_INTL.clearInput);
      expect(DEFAULT_TEXTBOX_INTL.clearInput).toBe('Clear input');
    });

    it('should render the clear text from a TEXTBOX_INTL override', async () => {
      await setup({ clearInput: 'Girdiyi temizle' });
      expect(clearButton()!.getAttribute('aria-label')).toBe('Girdiyi temizle');
    });

    it('should fall back to the default for keys left out of the override', async () => {
      await setup({});
      expect(clearButton()!.getAttribute('aria-label')).toBe(DEFAULT_TEXTBOX_INTL.clearInput);
    });

    it('should scope an override to the providing component subtree', async () => {
      @Component({
        imports: [TextboxComponent],
        providers: [{ provide: TEXTBOX_INTL, useValue: { clearInput: 'Temizle' } }],
        template: `<nui-textbox [clearable]="true" [value]="'x'" />`,
      })
      class HostComponent {}

      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [HostComponent],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();
      const host = TestBed.createComponent(HostComponent);
      host.detectChanges();

      const button = host.nativeElement.querySelector('.nui-textbox__clear') as HTMLButtonElement;
      expect(button.getAttribute('aria-label')).toBe('Temizle');
    });
  });
});
