import { MouseEvent } from 'react';
import { Editor } from 'slate';
import { Next } from '../../common';

/**
 * Function used to handle click.
 * Use next to call the next OnClick handler.
 * Next is undefined if there are no more OnClick handlers.
 */
export type OnClick = (
  event: MouseEvent<{}>,
  editor: Editor,
  next: Next<OnClick> | undefined
) => undefined | void;
