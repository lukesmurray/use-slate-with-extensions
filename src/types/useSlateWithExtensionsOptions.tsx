import { Descendant } from 'slate';
import { SlateExtension, SlatePlugin } from '.';

export interface useSlateWithExtensionsOptions {
  /**
   * The value of the slate editor
   */
  value: Descendant[];
  /**
   * callback for when the slate editor changes
   */
  onChange: (value: Descendant[]) => void;
  /**
   * extensions used to implement behavior
   */
  extensions?: SlateExtension[];
  /**
   * plugins used to extend the editor, plugin methods are called after all extension methods.
   * The plugins are applied in the order they are specified. i.e. from left to right.
   * If you supply your own plugins you must include `withReact`.
   * By default the applied plugins are `[withReact, withHistory]`
   */
  plugins?: SlatePlugin[];
}
