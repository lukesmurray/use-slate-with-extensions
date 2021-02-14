import { useCallback } from 'react';
import { Editor } from 'slate';
import { SlateExtension, SlatePlugin } from '../types';

/**
 * @see {InsertText}
 */
export const useInsertTextExtensionsPlugin = (
  extensions: SlateExtension[],
  insertTextDeps: any[]
): SlatePlugin => {
  return useCallback<SlatePlugin>(
    (editor: Editor) => {
      const { insertText: insertTextEditor } = editor;

      editor.insertText = text => {
        for (const extension of extensions) {
          const { insertText } = extension;
          if (insertText !== undefined) {
            insertText(text, editor);
          }
        }
        insertTextEditor(text);
      };

      return editor;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...insertTextDeps]
  );
};
