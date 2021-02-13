import React from 'react';
import { DefaultElement, RenderElementProps } from 'slate-react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { RenderElement, SlateExtension } from '../types';

/**
 * @see {RenderElement}
 */
export const renderElementExtensions = (
  extensions: SlateExtension[]
): ((props: RenderElementProps) => JSX.Element) => {
  const Tag = (elementProps: RenderElementProps) => {
    let element;

    extensions.some(({ renderElement }) => {
      element = renderElement && renderElement(elementProps);
      return !!element;
    });
    if (element) return element;

    return <DefaultElement {...elementProps} />;
  };

  // eslint-disable-next-line react/display-name
  return (elementProps: RenderElementProps) => {
    // A wrapper tag component to make useContext get correct value inside.
    return <Tag {...elementProps} />;
  };
};
