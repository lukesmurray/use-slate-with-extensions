import { Editor } from 'slate';

/**
 * Function called whenever the editor inserts a break.
 * Currently no way to control whether the next InsertBreak runs.
 */
export type InsertBreak = (editor: Editor) => void;
