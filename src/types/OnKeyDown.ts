import { KeyboardEvent } from 'react';
import { Editor } from 'slate';

/**
 * Function used to handle key down.
 * The return value indicates whether the next handler should run and defaults
 * to true.
 * To prevent the next handler from running return false.
 */
export type OnKeyDown = (
  event: KeyboardEvent<{}>,
  editor: Editor
) => boolean | undefined | void;
