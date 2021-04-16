import { Editor } from 'slate';
import { Next } from '../../common';

/**
 * Function called whenever data is inserted into the editor
 */
export type SetFragmentData = (
  data: DataTransfer,
  editor: Editor,
  next: Next<SetFragmentData>
) => void;
