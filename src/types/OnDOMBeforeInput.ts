import { Editor } from 'slate';

/**
 * Function used to handle before input events
 * The function is called on each of the extensions in turn.
 */
export type OnDOMBeforeInput = (event: Event, editor: Editor) => void;
