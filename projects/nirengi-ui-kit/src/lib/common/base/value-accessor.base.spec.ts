import { ValueAccessorBase } from './value-accessor.base';

class TestAccessor extends ValueAccessorBase<string> {}

describe('ValueAccessorBase', () => {
  let accessor: TestAccessor;

  beforeEach(() => {
    accessor = new TestAccessor();
  });

  it('should update value and call onChange when enabled', () => {
    const onChange = jasmine.createSpy('onChange');
    accessor.registerOnChange(onChange);

    accessor.updateValue('test');

    expect(accessor.value()).toBe('test');
    expect(onChange).toHaveBeenCalledWith('test');
  });

  it('should not update value when disabled', () => {
    const onChange = jasmine.createSpy('onChange');
    accessor.registerOnChange(onChange);
    accessor.setDisabledState(true);

    accessor.updateValue('blocked');

    expect(accessor.value()).toBeNull();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('should call onTouched when enabled', () => {
    const onTouched = jasmine.createSpy('onTouched');
    accessor.registerOnTouched(onTouched);

    accessor.markAsTouched();

    expect(onTouched).toHaveBeenCalled();
  });

  it('should not call onTouched when disabled', () => {
    const onTouched = jasmine.createSpy('onTouched');
    accessor.registerOnTouched(onTouched);
    accessor.setDisabledState(true);

    accessor.markAsTouched();

    expect(onTouched).not.toHaveBeenCalled();
  });

  it('should write value from model and set disabled state', () => {
    accessor.writeValue('model-value');
    accessor.setDisabledState(true);

    expect(accessor.value()).toBe('model-value');
    expect(accessor.isDisabled()).toBeTrue();
  });
});
