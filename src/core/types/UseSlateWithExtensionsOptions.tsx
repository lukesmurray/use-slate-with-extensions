import { Descendant, Editor } from 'slate';
import { SlateExtension, SlatePlugin } from '.';

export interface UseSlateWithExtensionsOptions {
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
   * extensions used to implement custom behavior
   */
  extensions?: SlateExtension[];

  /**
   * plugins used to extend the editor before any extensions have been applied.
   * These plugins are now allowed to have any dependencies and cannot change.
   * This is useful for supplying default editor behavior such as withReact and
   * withHistory which have no external dependencies.
   *
   * If you supply your own plugins you must include `withReact`.
   * By default the applied prePlugins are `[withReact, withHistory]`
   */
  prePlugins?: SlatePlugin[];

  /**
   * plugins used to extend the editor after all extensions have been applied.
   * these are provided to allow for compatibility with existing slate plugins.
   * The plugins are applied in the order they are specified. i.e. from left to
   * right.
   * If you supply your own plugins you must include `withReact`.
   * By default the applied plugins are `[withReact, withHistoryStable]`
   */
  postPlugins?: SlatePlugin[];

  /**
   * The dependencies for the passed in plugins
   */
  postPluginDeps?: any[];

  /**
   * optional initial state which can be used to render an uncontrolled editor.
   */
  initialState?: Descendant[];

  /**
   * you can pass the editor singleton but this is only really used for testing
   */
  editor?: Editor;
}
