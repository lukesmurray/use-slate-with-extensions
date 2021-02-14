import {
  Decorate,
  InsertBreak,
  IsInline,
  IsVoid,
  OnChange,
  OnDOMBeforeInput,
  OnKeyDown,
  RenderElement,
  RenderLeaf,
} from '.';

/**
 * The shape of a Slate extensions.
 * Implements interfaces from Slate React editable and Slate editor.
 */
export interface SlateExtension {
  /**
   * @see {RenderElement}
   */
  renderElement?: RenderElement;

  /**
   * Dependencies for renderElement
   */
  renderElementDeps?: any[];

  /**
   * @see {RenderLeaf}
   */
  renderLeaf?: RenderLeaf;

  /**
   * Dependencies for renderLeaf
   */
  renderLeafDeps?: any[];

  /**
   * @see {OnKeyDown}
   */
  onKeyDown?: OnKeyDown;

  /**
   * Dependencies for onKeyDown
   */
  onKeyDownDeps?: any[];

  /**
   * @see {IsInline}
   */
  isInline?: IsInline;

  /**
   * Dependencies for isInline
   */
  isInlineDeps?: any[];

  /**
   * @see {IsVoid}
   */
  isVoid?: IsVoid;

  /**
   * Dependencies for isVoid
   */
  isVoidDeps?: any[];

  /**
   * @see {OnChange}
   */
  onChange?: OnChange;

  /**
   * Dependencies for onChange
   */
  onChangeDeps?: any[];

  /**
   * @see {InsertBreak}
   */
  insertBreak?: InsertBreak;

  /**
   * Dependencies for insertBreak
   */
  insertBreakDeps?: any[];

  /**
   * @see {Decorate}
   */
  decorate?: Decorate;

  /**
   * Dependencies for decorate
   */
  decorateDeps?: any[];

  /**
   * @see {OnDOMBeforeInput}
   */
  onDOMBeforeInput?: OnDOMBeforeInput;

  /**
   * Dependencies for onDOMBeforeInput
   */
  onDOMBeforeInputDeps?: any[];
}
