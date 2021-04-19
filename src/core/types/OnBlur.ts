import { FocusEvent } from 'react';
import { Editor } from 'slate';
import { Next } from '../typeHelpers';

/**
 * Function used to handle blur.
 * Use next to call the next onBlur handler.
 * Next is undefined if there are no more onBlur handlers.
 */
export type OnBlur = (
  event: FocusEvent<{}>,
  editor: Editor,
  next: Next<OnBlur> | undefined
) => undefined | void;
