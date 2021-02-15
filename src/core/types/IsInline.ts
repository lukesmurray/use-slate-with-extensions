import { Editor, Element } from 'slate';
import { Next } from '../../common';

/**
 * Function used to determine if an element is an inline element.
 * Use next to call the next isInline handler.
 */
export type IsInline = (
  element: Element,
  editor: Editor,
  next: Next<IsInline>
) => boolean;
