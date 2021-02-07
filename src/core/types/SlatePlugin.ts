import { Editor } from 'slate';

/**
 * Simple type representing a slate plugin.
 * NOTE: see the readme for differences with how plugins are applied in useSlateWithExtensions
 * Plugins are different from extensions because they only have access to the `editor`
 * object.
 * Official plugins are `withHistory` and `withReact`
 */
export interface SlatePlugin {
  (editor: Editor): Editor;
}
