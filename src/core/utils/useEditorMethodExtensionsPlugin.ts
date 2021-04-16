import { useCallback } from 'react';
import { ReactEditor } from 'slate-react';
import { compose, FunctionPropertyNames, isDefined } from '../../common';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { SlateExtension, SlatePlugin } from '../types';

/**
 * Extend a method on the editor using the SlateExtensions
 */
export const useEditorMethodExtensionsPlugin = (
  extensions: SlateExtension[],
  method: FunctionPropertyNames<ReactEditor> & keyof SlateExtension
): SlatePlugin<ReactEditor> =>
  useCallback<SlatePlugin<ReactEditor>>(
    (editor: ReactEditor) => {
      const { [method]: editorMethod } = editor;

      const middleware = compose(
        ...extensions.map(extension => extension[method]).filter(isDefined),
        editorMethod as any
      );

      editor[method] = (...args: any[]) => {
        return middleware.apply(null, [...args, editor] as any) as any;
      };

      return editor;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...extensions.flatMap(e => e[`${method}Deps` as const] ?? [])]
  );
