import { Range } from 'slate';

/**
 * @see {Range.IsCollapsed}.
 * Return false if `range` is not defined.
 */
export const isCollapsed = (range?: Range | null): range is Range =>
  !!range && Range.isCollapsed(range);
