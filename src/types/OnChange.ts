import { Editor } from 'slate';

/**
 * Function called whenever a change occurs in an editor.
 * Currently no way to control whether the next OnChange runs.
 */
export type OnChange = (editor: Editor) => void;
