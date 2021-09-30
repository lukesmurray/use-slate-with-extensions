import React from 'react';
import { DefaultPlaceholder, RenderPlaceholderProps } from 'slate-react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { SlateExtension } from '../types';

/**
 * @see {RenderPlaceholder}
 */
export const renderPlaceholderExtensions = (
  extensions: SlateExtension[]
): ((props: RenderPlaceholderProps) => JSX.Element) => {
  const Tag = (placeholderProps: RenderPlaceholderProps) => {
    let placeholder;

    extensions.some(({ renderPlaceholder }) => {
      placeholder = renderPlaceholder && renderPlaceholder(placeholderProps);
      return !!placeholder;
    });
    if (placeholder) return placeholder;

    return <DefaultPlaceholder {...placeholderProps} />;
  };

  // eslint-disable-next-line react/display-name
  return (placeholderProps: RenderPlaceholderProps) => {
    // A wrapper tag component to make useContext get correct value inside.
    return <Tag {...placeholderProps} />;
  };
};
