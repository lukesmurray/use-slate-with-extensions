import { Editor, Node } from 'slate';
import { Next } from '../../common';

/**
 * Function called whenever insert node occurs in the editor.
 * Use next to call the next insertNode handler.
 */
export type InsertNode = (
  node: Node,
  editor: Editor,
  next: Next<InsertNode>
) => void;
