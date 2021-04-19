import { Editor } from 'slate';
import { Next } from '../typeHelpers';

/**
 * Function called whenever a mark is removed from the editor.
 * Use next to call the next removeMark handler.
 */
export type RemoveMark = (
  key: string,
  editor: Editor,
  next: Next<RemoveMark>
) => void;
