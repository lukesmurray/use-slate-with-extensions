import { Editor } from 'slate';
import { Slate } from 'slate-react';
import { EditableProps } from 'slate-react/dist/components/editable';
import { SlateExtension } from './SlateExtension';

/**
 * The editable props managed by UseSlateWithExtensions
 */
export type EditableWithExtensionsProps = Pick<
  EditableProps,
  keyof SlateExtension & keyof EditableProps
>;

/**
 * The slate props managed by UseSlateWithExtensions
 */
export type SlateWithExtensionsProps = Omit<
  Parameters<typeof Slate>[0],
  'children'
>;

export type UseSlateWithExtensionsResult = {
  getSlateProps: () => SlateWithExtensionsProps;
  getEditableProps: () => EditableWithExtensionsProps;
  editor: Editor;
};
