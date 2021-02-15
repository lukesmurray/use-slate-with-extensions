import { Editor, NodeEntry } from 'slate';
import { Next } from '../../common';

/**
 * Function called whenever normalization occurs in the editor.
 * Use next to call the next normalizeNode handler.
 */
export type NormalizeNode = (
  entry: NodeEntry,
  editor: Editor,
  next: Next<NormalizeNode>
) => void;
