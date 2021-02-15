import { useMemo } from 'react';
import { Editor } from 'slate';
import { EditableProps } from 'slate-react/dist/components/editable';
import { compose, isDefined } from '../../common';
import { SlateExtension } from '../types';

export const useOnDOMBeforeInputHandler = (
  editor: Editor,
  extensions: SlateExtension[]
) => {
  return useMemo<EditableProps['onDOMBeforeInput']>(() => {
    const handlers = extensions.map(x => x.onDOMBeforeInput).filter(isDefined);
    if (handlers.length === 0) {
      return undefined;
    }
    const middleware = compose(...handlers);
    return e => middleware(e as InputEvent, editor);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...extensions.flatMap(e => e.onDOMBeforeInputDeps ?? [])]);
};
