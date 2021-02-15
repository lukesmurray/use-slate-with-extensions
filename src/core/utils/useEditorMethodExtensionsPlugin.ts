import { useCallback } from 'react';
import { Editor } from 'slate';
import { compose, FunctionPropertyNames, isDefined } from '../../common';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { SlateExtension, SlatePlugin } from '../types';

export const useEditorMethodExtensionsPlugin = (
  extensions: SlateExtension[],
  method: FunctionPropertyNames<Editor>
): SlatePlugin =>
  useCallback<SlatePlugin>(
    (editor: Editor) => {
      const { [method]: editorMethod } = editor;

      const middleware = compose(
        ...extensions.map(extension => extension[method]).filter(isDefined),
        editorMethod
      );

      editor[method] = (...args: any[]) => {
        return middleware.apply(null, [...args, editor] as any) as any;
      };

      return editor;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...extensions.flatMap(e => e[`${method}Deps` as const] ?? [])]
  );
