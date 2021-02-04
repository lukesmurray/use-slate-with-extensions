import { Editor } from 'slate';
import { SlateExtension } from '../types';

export const onDOMBeforeInputExtensions = (
  editor: Editor,
  extensions: SlateExtension[]
) => (event: Event) => {
  extensions.forEach(({ onDOMBeforeInput }) => {
    onDOMBeforeInput && onDOMBeforeInput(event, editor);
  });
};
