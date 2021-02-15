import { KeyboardEvent } from 'react';
import { Editor } from 'slate';
import { Next } from '../../common';

/**
 * Function used to handle key down.
 * Use next to call the next onKeyDown handler.
 * Next is undefined if there are no more onKeyDown handlers.
 */
export type OnKeyDown = (
  event: KeyboardEvent<{}>,
  editor: Editor,
  next: Next<OnKeyDown> | undefined
) => undefined | void;
