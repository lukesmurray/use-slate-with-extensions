import React from 'react';
import { DefaultLeaf, RenderLeafProps } from 'slate-react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { RenderLeaf, SlateExtension } from '../types';

/**
 * @see {RenderLeaf}
 */
export const renderLeafExtensions = (
  extensions: SlateExtension[]
): ((props: RenderLeafProps) => JSX.Element) => {
  const Tag = (props: RenderLeafProps) => {
    const leafProps: RenderLeafProps = { ...props }; // workaround for children readonly error.
    extensions.forEach(({ renderLeaf }) => {
      if (renderLeaf) {
        const newChildren = renderLeaf(leafProps);
        if (newChildren !== undefined) {
          leafProps.children = newChildren;
        }
      }
    });

    return <DefaultLeaf {...leafProps} />;
  };

  // eslint-disable-next-line react/display-name
  return (LeafProps: RenderLeafProps) => {
    // XXX: A wrapper tag component to make useContext get correct value inside.
    return <Tag {...LeafProps} />;
  };
};
