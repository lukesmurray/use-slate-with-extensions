import { Editor } from 'slate';
import { Next } from '../../common';

/**
 * Function called whenever the editor inserts a break.
 * Use next to call the next insertBreak handler.
 */
export type InsertBreak = (editor: Editor, next: Next<InsertBreak>) => void;
