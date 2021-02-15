import {
  AddMark,
  Apply,
  Decorate,
  DeleteBackward,
  DeleteForward,
  DeleteFragment,
  GetFragment,
  InsertBreak,
  InsertFragment,
  InsertNode,
  InsertText,
  IsInline,
  IsVoid,
  NormalizeNode,
  OnChange,
  OnDOMBeforeInput,
  OnKeyDown,
  RemoveMark,
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
   * @see {NormalizeNode}
   */
  normalizeNode?: NormalizeNode;

  /**
   * Dependencies for NormalizeNode
   */
  normalizeNodeDeps?: any[];

  /**
   * @see {InsertBreak}
   */
  insertBreak?: InsertBreak;

  /**
   * Dependencies for insertBreak
   */
  insertBreakDeps?: any[];

  /**
   * @see {InsertText}
   */
  insertText?: InsertText;

  /**
   * Dependencies for insertText
   */
  insertTextDeps?: any[];

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

  /**
   * @see {AddMark}
   */
  addMark?: AddMark;

  /**
   * Dependencies for addMark
   */
  addMarkDeps?: any[];

  /**
   * @see {Apply}
   */
  apply?: Apply;

  /**
   * Dependencies for apply
   */
  applyDeps?: any[];

  /**
   * @see {DeleteBackward}
   */
  deleteBackward?: DeleteBackward;

  /**
   * Dependencies for deleteBackward
   */
  deleteBackwardDeps?: any[];

  /**
   * @see {DeleteForward}
   */
  deleteForward?: DeleteForward;

  /**
   * Dependencies for deleteForward
   */
  deleteForwardDeps?: any[];

  /**
   * @see {DeleteFragment}
   */
  deleteFragment?: DeleteFragment;

  /**
   * Dependencies for deleteFragment
   */
  deleteFragmentDeps?: any[];

  /**
   * @see {GetFragment}
   */
  getFragment?: GetFragment;

  /**
   * Dependencies for getFragment
   */
  getFragmentDeps?: any[];

  /**
   * @see {InsertFragment}
   */
  insertFragment?: InsertFragment;

  /**
   * Dependencies for insertFragment
   */
  insertFragmentDeps?: any[];

  /**
   * @see {InsertNode}
   */
  insertNode?: InsertNode;

  /**
   * Dependencies for insertNode
   */
  insertNodeDeps?: any[];

  /**
   * @see {RemoveMark}
   */
  removeMark?: RemoveMark;

  /**
   * Dependencies for removeMark
   */
  removeMarkDeps?: any[];
}
