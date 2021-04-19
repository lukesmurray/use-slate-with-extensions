import { useMemo } from 'react';
import { Editor } from 'slate';
import { EditableProps } from 'slate-react/dist/components/editable';
import { compose } from '../fpUtils';
import { isDefined } from '../guards';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { SlateExtension } from '../types';

/**
 * Extend a dom event on the editable using the SlateExtensions
 * Does not work for any other methods on the Editable but the type safety
 * is limited and doesn't check to verify that this is being called on a dom event
 */
export const useEditableEventExtensionsPlugin = <
  K extends keyof EditableProps & keyof SlateExtension
>(
  editor: Editor,
  extensions: SlateExtension[],
  method: K
) => {
  return useMemo<EditableProps[K]>(
    () => {
      const handlers = extensions.map(x => x[method]).filter(isDefined);
      if (handlers.length === 0) {
        return undefined;
      }
      const middleware = compose(...handlers);
      //@ts-ignore
      return e => middleware(e, editor) as any;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...extensions.flatMap(e => e[`${method}Deps` as const] ?? [])]
  );
};
