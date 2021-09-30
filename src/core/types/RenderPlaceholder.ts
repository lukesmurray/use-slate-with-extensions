import { RenderPlaceholderProps } from 'slate-react';

/**
 * Function used to render a placeholder.
 * If the function returns undefined then the next RenderPlaceholder function is called.
 * If the function renders a JSX element then that JSX element is rendered.
 */
export type RenderPlaceholder = (
  props: RenderPlaceholderProps
) => JSX.Element | undefined | void;
