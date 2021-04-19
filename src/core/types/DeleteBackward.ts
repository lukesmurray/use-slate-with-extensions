import { Editor } from 'slate';
import { Next } from '../typeHelpers';

/**
 * Function called whenever delete backward occurs in the editor.
 * Use next to call the next deleteBackward handler.
 */
export type DeleteBackward = (
  unit: 'character' | 'word' | 'line' | 'block',
  editor: Editor,
  next: Next<DeleteBackward>
) => void;
