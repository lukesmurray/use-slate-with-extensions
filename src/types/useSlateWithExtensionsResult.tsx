import { Slate } from 'slate-react';
import { EditableProps } from 'slate-react/dist/components/editable';

/**
 * The editable props managed by UseSlateWithExtensions
 */
export type EditableWithExtensionsProps = Pick<
  EditableProps,
  'renderElement' | 'renderLeaf' | 'onKeyDown' | 'decorate' | 'onDOMBeforeInput'
>;
/**
 * The slate props managed by UseSlateWithExtensions
 */
export type SlateWithExtensionsProps = Omit<
  Parameters<typeof Slate>[0],
  'children'
>;

export type useSlateWithExtensionsResult = {
  getSlateProps: () => SlateWithExtensionsProps;
  getEditableProps: () => EditableWithExtensionsProps;
};
