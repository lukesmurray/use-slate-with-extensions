import { useCallback } from 'react';
import { Editor } from 'slate';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IsVoid, SlateExtension, SlatePlugin } from '../types';

/**
 * @see {IsVoid}
 */
export const useIsVoidExtensionsPlugin = (
  extensions: SlateExtension[],
  isVoidDeps: any[]
): SlatePlugin => {
  return useCallback<SlatePlugin>(
    (editor: Editor) => {
      const { isVoid: isVoidEditor } = editor;

      editor.isVoid = element => {
        for (const extension of extensions) {
          const { isVoid } = extension;
          if (isVoid !== undefined) {
            const result = isVoid(editor, element);
            if (result !== undefined) {
              return result;
            }
          }
        }
        return isVoidEditor(element);
      };
      return editor;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...isVoidDeps]
  );
};
