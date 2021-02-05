import { Editor } from 'slate';
import { SlateExtension } from '../types';

export const onDOMBeforeInputExtensions = (
  editor: Editor,
  extensions: SlateExtension[]
) => (event: Event) => {
  extensions.some(
    ({ onDOMBeforeInput }) =>
      onDOMBeforeInput?.(event as InputEvent, editor) === false
  );
};
