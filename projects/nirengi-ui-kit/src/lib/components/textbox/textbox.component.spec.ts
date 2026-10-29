import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection } from '@angular/core';
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
