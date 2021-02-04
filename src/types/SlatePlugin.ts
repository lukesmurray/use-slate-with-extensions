import { Editor } from 'slate';

/**
 * Simple type representing a slate plugin.
 * Plugins are different from extensions because they only have access to the `editor`
 * object.
 * Common plugins are `withHistory` and `withReact`
 */
export interface SlatePlugin {
  (editor: Editor): Editor;
}
