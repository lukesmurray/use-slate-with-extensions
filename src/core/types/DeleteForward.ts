import { Editor } from 'slate';
import { Next } from '../typeHelpers';

/**
 * Function called whenever delete forward occurs in the editor.
 * Use next to call the next deleteForward handler.
 */
export type DeleteForward = (
  unit: 'character' | 'word' | 'line' | 'block',
  editor: Editor,
  next: Next<DeleteForward>
) => void;
