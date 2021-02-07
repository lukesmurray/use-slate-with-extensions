import { useCallback } from 'react';
import { Editor } from 'slate';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IsInline, SlateExtension, SlatePlugin } from '../types';

/**
 * @see {IsInline}
 */
export const useIsInlineExtensionsPlugin = (
  extensions: SlateExtension[],
  isInlineDeps: any[]
): SlatePlugin => {
  return useCallback<SlatePlugin>(
    (editor: Editor) => {
      const { isInline: isInlineEditor } = editor;

      editor.isInline = element => {
        for (const extension of extensions) {
          const { isInline } = extension;
          if (isInline !== undefined) {
            const result = isInline(editor, element);
            if (result !== undefined) {
              return result;
            }
          }
        }
        return isInlineEditor(element);
      };
      return editor;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...isInlineDeps]
  );
};
