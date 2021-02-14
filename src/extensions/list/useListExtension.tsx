import React from 'react';
import { Editor, Transforms } from 'slate';
import {
  getRangeFromBlockStart,
  getText,
  isCollapsed,
  SlateExtension,
} from '../..';

// custom types for the list extension
declare module 'slate' {
  export interface CustomTypes {
    Element: { type: 'ul' };
  }
}

const useListExtension = (): SlateExtension => {
  return {
    insertText: (text, editor) => {
      if (!isCollapsed(editor.selection)) {
        const rangeFromBlockStart = getRangeFromBlockStart(editor);
        const textFromBlockStart = getText(editor, rangeFromBlockStart);

        if (textFromBlockStart === '- ') {
          // Transforms.delete(editor, { at: rangeFromBlockStart });
          // Transforms.setNodes(
          //   editor,
          //   //@ts-expect-error
          //   { type: 'ul' },
          //   { match: n => Editor.isBlock(editor, n) }
          // );
          // preformat (unwrapList)
          // unwrap list items
          // unwrap unordered list but split
          // format (toggleList)
          // unwrap the list
          // wrap the nodes in a ul
          // if not active
          // wrap nodes in list items
        }

        return;
      }
    },
    renderElement: ({ attributes, children, element }) => {
      if (element.type === 'ul') {
        return <ul {...attributes}>{children}</ul>;
      }
      return undefined;
    },
  };
};
