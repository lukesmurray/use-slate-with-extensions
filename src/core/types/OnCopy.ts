import { ClipboardEvent } from 'react';
import { Editor } from 'slate';
import { Next } from '../../common';

/**
 * Function used to handle copy.
 * Use next to call the next OnCopy handler.
 * Next is undefined if there are no more OnCopy handlers.
 */
export type OnCopy = (
  event: ClipboardEvent<{}>,
  editor: Editor,
  next: Next<OnCopy> | undefined
) => undefined | void;
