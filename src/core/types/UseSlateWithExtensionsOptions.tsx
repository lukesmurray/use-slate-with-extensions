import { Descendant, Editor } from 'slate';
import { SlateExtension, SlatePlugin } from '.';

export interface useSlateWithExtensionsOptions {
  /**
   * The value of the slate editor used to render a controlled editor.
   */
  value?: Descendant[];
  /**
   * callback for when the slate editor changes
   * used to render a controlled editor.
   */
  onChange?: (value: Descendant[]) => void;
  /**
   * extensions used to implement behavior
   */
  extensions?: SlateExtension[];
  /**
   * plugins used to extend the editor. withHistory is incompatible with useSlateWithExtensions. use withHistoryStable instead.
   * plugin methods are called after all extension methods.
   * The plugins are applied in the order they are specified. i.e. from left to right.
   * If you supply your own plugins you must include `withReact`.
   * By default the applied plugins are `[withReact, withHistoryStable]`
   */
  plugins?: SlatePlugin[];

  /**
   * The dependencies for the passed in plugins
   */
  pluginsDeps?: any[];

  /**
   * optional initial state which can be used to render an uncontrolled editor.
   */
  initialState?: Descendant[];

  /**
   * you can pass the editor singleton but this is only really used for testing
   */
  editor?: Editor;
}
