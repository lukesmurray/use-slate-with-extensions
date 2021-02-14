import { Editor } from 'slate';
import { EditorAboveOptions } from '../types/EditorAboveOptions';
import { getPointFromLocation } from './getPointFromLocation';

/**
 * Get the range from the start of the block above a location (default: selection) to the location.
 */
export const getRangeFromBlockStart = (
  editor: Editor,
  options?: EditorAboveOptions
) => {
  const nodeEntry = Editor.above(editor, options);
  if (nodeEntry === undefined) {
    return;
  }
  const [, path] = nodeEntry;

  const start = Editor.start(editor, path);

  const focus = getPointFromLocation(editor, options);

  if (!focus) {
    return;
  }

  return { anchor: start, focus };
};
