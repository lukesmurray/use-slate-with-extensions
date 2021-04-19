import { ClipboardEvent } from 'react';
import { Editor } from 'slate';
import { Next } from '../typeHelpers';

/**
 * Function used to handle paste.
 * Use next to call the next OnPaste handler.
 * Next is undefined if there are no more OnPaste handlers.
 */
export type OnPaste = (
  event: ClipboardEvent<{}>,
  editor: Editor,
  next: Next<OnPaste> | undefined
) => undefined | void;
