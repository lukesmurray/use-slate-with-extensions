import { DragEvent } from 'react';
import { Editor } from 'slate';
import { Next } from '../typeHelpers';

/**
 * Function used to handle Drop.
 * Use next to call the next OnDrop handler.
 * Next is undefined if there are no more OnDrop handlers.
 */
export type OnDrop = (
  event: DragEvent<{}>,
  editor: Editor,
  next: Next<OnDrop> | undefined
) => undefined | void;
