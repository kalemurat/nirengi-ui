import { TreeNodeTrailingDirective } from './tree-node-trailing.directive';

describe('TreeNodeTrailingDirective', () => {
  it('narrows the template context type for the compiler', () => {
    expect(TreeNodeTrailingDirective.ngTemplateContextGuard({} as never, {})).toBe(true);
  });
});
