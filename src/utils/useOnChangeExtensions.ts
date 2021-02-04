import { useEffect } from 'react';
import { Editor } from 'slate';
import { SlateExtension } from '../types';

/**
 * @see {OnChange}
 */
export const useOnChangeExtensions = (
  editor: Editor,
  extensions: SlateExtension[],
  onChangeDeps: any[]
): void => {
  useEffect(() => {
    const { onChange: OnChangeEditor } = editor;

    editor.onChange = () => {
      for (const extension of extensions) {
        const { onChange } = extension;
        if (onChange !== undefined) {
          onChange(editor);
        }
      }
      OnChangeEditor();
    };

    return () => {
      editor.onChange = OnChangeEditor;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, ...onChangeDeps]);
};
