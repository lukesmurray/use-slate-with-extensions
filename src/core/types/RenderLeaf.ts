import { RenderLeafProps } from 'slate-react';

/**
 * Function used to render the children of a leaf.
 * If the function returns undefined then the next RenderLeaf function is called and the current children are not modified.
 * The children passed to the function may be the result of a previous extension.
 * To wrap the previous extension simply return the passed children.
 * You do not need to add the attributes to your return value.
 * The attributes are added by default.
 */
export type RenderLeaf = (props: RenderLeafProps) => JSX.Element | undefined;
