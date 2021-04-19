import { Editor } from 'slate';
import { Next } from '../typeHelpers';

/**
 * Function used to handle before input events.
 * Use next to call the next onDOMBeforeInput handler.
 * Next is undefined if there are no more onDOMBeforeInput handlers.
 */
export type OnDOMBeforeInput = (
  event: InputEvent,
  editor: Editor,
  next: Next<OnDOMBeforeInput> | undefined
) => undefined | void;
