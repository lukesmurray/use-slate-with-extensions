import { DragEvent } from 'react';
import { Editor } from 'slate';
import { Next } from '../../common';

/**
 * Function used to handle dragOver.
 * Use next to call the next OnDragOver handler.
 * Next is undefined if there are no more OnDragOver handlers.
 */
export type OnDragOver = (
  event: DragEvent<{}>,
  editor: Editor,
  next: Next<OnDragOver> | undefined
) => undefined | void;
