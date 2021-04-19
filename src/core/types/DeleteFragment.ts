import { Editor } from 'slate';
import { Next } from '../typeHelpers';

/**
 * Function called whenever delete fragment occurs in the editor.
 * Use next to call the next deleteFragment handler.
 */
export type DeleteFragment = (
  editor: Editor,
  next: Next<DeleteFragment>
) => void;
