import { FocusEvent } from 'react';
import { Editor } from 'slate';
import { Next } from '../../common';

/**
 * Function used to handle focus.
 * Use next to call the next onFocus handler.
 * Next is undefined if there are no more onFocus handlers.
 */
export type OnFocus = (
  event: FocusEvent<{}>,
  editor: Editor,
  next: Next<OnFocus> | undefined
) => undefined | void;
