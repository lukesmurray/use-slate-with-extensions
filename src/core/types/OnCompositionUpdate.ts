import { CompositionEvent } from 'react';
import { Editor } from 'slate';
import { Next } from '../../common';

/**
 * Function used to handle composition update.
 * Use next to call the next OnCompositionUpdate handler.
 * Next is undefined if there are no more OnCompositionUpdate handlers.
 */
export type OnCompositionUpdate = (
  event: CompositionEvent<{}>,
  editor: Editor,
  next: Next<OnCompositionUpdate> | undefined
) => undefined | void;
