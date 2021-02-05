import { Editor, Element } from 'slate';

/**
 * Function used to determine if an element is an inline element.
 * If the function returns undefined then the next IsInline function is called.
 * If the function returns a boolean then that is assumed to be the value for IsInline.
 */
export type IsInline = (
  editor: Editor,
  element: Element
) => boolean | undefined;
