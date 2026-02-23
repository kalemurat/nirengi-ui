import { Type } from '@angular/core';
import { ComponentRegistryService } from './component-registry.service';
import { IComponentShowcaseConfig } from '../interfaces/showcase-config.interface';

class MockComponent {}

describe('ComponentRegistryService', () => {
  let service: ComponentRegistryService;

  const buildConfig = (id: string, category = 'General'): IComponentShowcaseConfig => ({
    id,
    name: id,
    description: `${id} description`,
    category,
    selector: `nui-${id}`,
    properties: [],
  });

  beforeEach(() => {
    service = new ComponentRegistryService();
  });

  it('should register component and resolve it from loader', async () => {
    const config = buildConfig('button', 'Controls');
    const loader = jasmine.createSpy().and.resolveTo(MockComponent as unknown as Type<unknown>);

    service.registerComponent(config, loader);

    const component = await service.getComponent('button');
    expect(component).toBe(MockComponent as unknown as Type<unknown>);
    expect(loader).toHaveBeenCalledTimes(1);
  });

  it('should use cache after first component load', async () => {
    const config = buildConfig('badge');
    const loader = jasmine.createSpy().and.resolveTo(MockComponent as unknown as Type<unknown>);

    service.registerComponent(config, loader);

    await service.getComponent('badge');
    await service.getComponent('badge');

    expect(loader).toHaveBeenCalledTimes(1);
  });

  it('should register config and expose grouped categories', () => {
    service.registerConfig(buildConfig('button', 'Controls'));
    service.registerConfig(buildConfig('input', 'Forms'));
    service.registerConfig(buildConfig('switch', 'Forms'));

    const grouped = new Map(service.configsByCategory());

    expect(grouped.get('Controls')?.length).toBe(1);
    expect(grouped.get('Forms')?.length).toBe(2);
    expect(service.allConfigs().length).toBe(3);
  });

  it('should provide config and component id helpers', () => {
    const config = buildConfig('checkbox');
    service.registerConfig(config);

    expect(service.getConfig('checkbox')).toEqual(config);
    expect(service.hasComponent('checkbox')).toBeTrue();
    expect(service.getAllComponentIds()).toEqual(['checkbox']);
  });

  it('should throw error for unknown component without loader', async () => {
    await expectAsync(service.getComponent('unknown')).toBeRejectedWithError(
      'Component "unknown" is not registered in the registry or missing loader.'
    );
  });
});
