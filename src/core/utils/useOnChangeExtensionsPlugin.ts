import { useCallback } from 'react';
import { Editor } from 'slate';
import { SlateExtension, SlatePlugin } from '../types';

/**
 * @see {OnChange}
 */
export const useOnChangeExtensionsPlugin = (
  extensions: SlateExtension[],
  onChangeDeps: any[]
): SlatePlugin => {
  return useCallback<SlatePlugin>(
    (editor: Editor) => {
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

      return editor;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...onChangeDeps]
  );
};
