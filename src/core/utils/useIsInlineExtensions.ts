import { useEffect } from 'react';
import { Editor } from 'slate';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IsInline, SlateExtension } from '../types';

/**
 * @see {IsInline}
 */
export const useIsInlineExtensions = (
  editor: Editor,
  extensions: SlateExtension[],
  isInlineDeps: any[]
): void => {
  useEffect(() => {
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

    return () => {
      editor.isInline = isInlineEditor;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, ...isInlineDeps]);
};
