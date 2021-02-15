import { Editor } from 'slate';
import { Next } from '../../common';

/**
 * Function called whenever a change occurs in an editor.
 * Use next to call the next onChange handler.
 */
export type OnChange = (editor: Editor, next: Next<OnChange>) => void;
