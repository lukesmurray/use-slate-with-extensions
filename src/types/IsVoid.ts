import { Editor, Element } from 'slate';

/**
 * Function used to determine if an element is a void element.
 * If the function returns undefined then the next IsVoid function is called.
 * If the function returns a boolean then that is assumed to be the value for IsVoid.
 */
export type IsVoid = (editor: Editor, element: Element) => boolean | undefined;
