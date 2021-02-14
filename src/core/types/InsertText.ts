import { Editor } from 'slate';

/**
 * Function called whenever the editor inserts text.
 * Currently no way to control whether the next InsertText runs.
 */
export type InsertText = (text: string, editor: Editor) => void;
