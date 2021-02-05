import { useEffect } from 'react';
import { Editor } from 'slate';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IsVoid, SlateExtension } from '../types';

/**
 * @see {IsVoid}
 */
export const useIsVoidExtensions = (
  editor: Editor,
  extensions: SlateExtension[],
  isVoidDeps: any[]
): void => {
  useEffect(() => {
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

    return () => {
      editor.isVoid = isVoidEditor;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, ...isVoidDeps]);
};
