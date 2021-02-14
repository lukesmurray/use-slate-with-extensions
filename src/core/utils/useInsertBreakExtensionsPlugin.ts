import { useCallback } from 'react';
import { Editor } from 'slate';
import { SlateExtension, SlatePlugin } from '../types';

/**
 * @see {InsertBreak}
 */
export const useInsertBreakExtensionsPlugin = (
  extensions: SlateExtension[],
  insertBreakDeps: any[]
): SlatePlugin => {
  return useCallback<SlatePlugin>(
    (editor: Editor) => {
      const { insertBreak: insertBreakEditor } = editor;

      editor.insertBreak = () => {
        for (const extension of extensions) {
          const { insertBreak } = extension;
          if (insertBreak !== undefined) {
            insertBreak(editor);
          }
        }
        insertBreakEditor();
      };

      return editor;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...insertBreakDeps]
  );
};
