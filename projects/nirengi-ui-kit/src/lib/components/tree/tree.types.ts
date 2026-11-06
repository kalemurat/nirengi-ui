/**
 * A node rendered by `nui-tree`.
 *
 * Nodes nest through `children`; a node with a non-empty `children` array is
 * expandable. `id` must be unique across the whole tree because it is the value
 * used for selection and for the controllable expanded state.
 *
 * @typeParam T - Optional consumer payload carried on `data`, for example a count
 * rendered by a trailing template.
 */
export interface ITreeNode<T = unknown> {
  /** Unique identifier across the whole tree. */
  id: string;

  /** Visible label; also used for type-ahead. */
  label: string;

  /** Child nodes. A non-empty array makes the node expandable. */
  children?: ITreeNode<T>[];

  /** Disabled nodes stay visible but cannot be selected or expanded. */
  disabled?: boolean;

  /** Free-form payload for consumer templates; the tree never reads it. */
  data?: T;
}

/**
 * Context passed to a `nuiTreeNodeTrailing` template.
 *
 * @typeParam T - Payload type of the node's `data`.
 */
export interface ITreeNodeContext<T = unknown> {
  /** The node being rendered (default template variable). */
  $implicit: ITreeNode<T>;

  /** The node being rendered. */
  node: ITreeNode<T>;

  /** 1-based depth of the node (`aria-level`). */
  level: number;

  /** Whether the node is currently expanded. Always `false` for leaves. */
  expanded: boolean;

  /** Whether the node is currently selected. */
  selected: boolean;
}

/** Sizes supported by `nui-tree`. */
export type TreeSize = 'sm' | 'md' | 'lg';
