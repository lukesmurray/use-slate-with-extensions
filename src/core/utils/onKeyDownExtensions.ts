import { Editor } from 'slate';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { OnKeyDown, SlateExtension } from '../types';

/**
 * @see {OnKeyDown}
 */
export const onKeyDownExtensions = (
  editor: Editor,
  extensions: SlateExtension[]
) => (event: any) => {
  extensions.some(({ onKeyDown }) => onKeyDown?.(event, editor) === false);
};
