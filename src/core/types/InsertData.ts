import { Editor } from 'slate';
import { Next } from '../typeHelpers';

/**
 * Function called whenever data is inserted into the editor
 */
export type InsertData = (
  data: DataTransfer,
  editor: Editor,
  next: Next<InsertData>
) => void;
