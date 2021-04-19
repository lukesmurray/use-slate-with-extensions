import { CompositionEvent } from 'react';
import { Editor } from 'slate';
import { Next } from '../typeHelpers';

/**
 * Function used to handle composition end.
 * Use next to call the next OnCompositionEnd handler.
 * Next is undefined if there are no more OnCompositionEnd handlers.
 */
export type OnCompositionEnd = (
  event: CompositionEvent<{}>,
  editor: Editor,
  next: Next<OnCompositionEnd> | undefined
) => undefined | void;
