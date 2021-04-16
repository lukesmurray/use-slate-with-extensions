import { DragEvent } from 'react';
import { Editor } from 'slate';
import { Next } from '../../common';

/**
 * Function used to handle dragStart.
 * Use next to call the next OnDragStart handler.
 * Next is undefined if there are no more OnDragStart handlers.
 */
export type OnDragStart = (
  event: DragEvent<{}>,
  editor: Editor,
  next: Next<OnDragStart> | undefined
) => undefined | void;
