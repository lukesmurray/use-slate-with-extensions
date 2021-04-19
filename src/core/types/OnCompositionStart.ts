import { CompositionEvent } from 'react';
import { Editor } from 'slate';
import { Next } from '../typeHelpers';

/**
 * Function used to handle composition start.
 * Use next to call the next OnCompositionStart handler.
 * Next is undefined if there are no more OnCompositionStart handlers.
 */
export type OnCompositionStart = (
  event: CompositionEvent<{}>,
  editor: Editor,
  next: Next<OnCompositionStart> | undefined
) => undefined | void;
