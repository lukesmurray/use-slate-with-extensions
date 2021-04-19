import { ClipboardEvent } from 'react';
import { Editor } from 'slate';
import { Next } from '../typeHelpers';

/**
 * Function used to handle cut.
 * Use next to call the next OnCut handler.
 * Next is undefined if there are no more OnCut handlers.
 */
export type OnCut = (
  event: ClipboardEvent<{}>,
  editor: Editor,
  next: Next<OnCut> | undefined
) => undefined | void;
