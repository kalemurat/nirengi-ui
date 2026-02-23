import { PropertyStateService } from './property-state.service';
import { IComponentShowcaseConfig } from '../interfaces/showcase-config.interface';

describe('PropertyStateService', () => {
  let service: PropertyStateService;

  beforeEach(() => {
    service = new PropertyStateService();
  });

  it('should set and get a property', () => {
    service.setProperty('variant', 'primary');

    expect(service.getProperty('variant')).toBe('primary');
  });

  it('should reset values to config defaults', () => {
    const config: IComponentShowcaseConfig = {
      id: 'button',
      name: 'Button',
      description: 'Button component',
      category: 'Controls',
      selector: 'nui-button',
      properties: [
        { name: 'label', type: 'string', defaultValue: 'Save', label: 'Label' },
        { name: 'disabled', type: 'boolean', defaultValue: false, label: 'Disabled' },
      ],
      events: [{ name: 'clicked', label: 'Clicked' }],
    };

    service.setProperty('label', 'Old');
    service.resetToDefaults(config);

    expect(service.getProperty('label')).toBe('Save');
    expect(service.getProperty('disabled')).toBeFalse();
  });

  it('should clear all properties', () => {
    service.setProperty('size', 'md');
    service.clear();

    expect(service.allProperties()).toEqual({});
  });
});
