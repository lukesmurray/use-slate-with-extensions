import { Editor } from 'slate';
import { Next } from '../typeHelpers';

/**
 * Function called whenever the editor inserts text.
 * Use next to call the next insertText handler.
 */
export type InsertText = (
  text: string,
  editor: Editor,
  next: Next<InsertText>
) => void;
