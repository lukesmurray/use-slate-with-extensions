import {
  AddMark,
  Apply,
  Decorate,
  DeleteBackward,
  DeleteForward,
  DeleteFragment,
  GetFragment,
  InsertBreak,
  InsertData,
  InsertFragment,
  InsertNode,
  InsertText,
  IsInline,
  IsVoid,
  NormalizeNode,
  OnBlur,
  OnChange,
  OnClick,
  OnCompositionEnd,
  OnCompositionStart,
  OnCompositionUpdate,
  OnCopy,
  OnCut,
  OnDOMBeforeInput,
  OnDragOver,
  OnDragStart,
  OnDrop,
  OnFocus,
  OnKeyDown,
  OnPaste,
  RemoveMark,
  RenderElement,
  RenderLeaf,
  SetFragmentData,
} from '.';
import { RenderPlaceholder } from './RenderPlaceholder';

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
   * @see {RenderPlaceholder}
   */
  renderPlaceholder?: RenderPlaceholder;

  /**
   * Dependencies for renderPlaceholder
   */
  renderPlaceholderDeps?: any[];

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

  /**
   * @see {InsertData}
   */
  insertData?: InsertData;

  /**
   * Dependencies for InsertData
   */
  insertDataDeps?: any[];

  /**
   * @see {SetFragmentData}
   */
  setFragmentData?: SetFragmentData;

  /**
   * Dependencies for SetFragmentData
   */
  setFragmentDataDeps?: any[];

  /**
   * @see {OnBlur}
   */
  onBlur?: OnBlur;

  /**
   * Dependencies for onBlur
   */
  onBlurDeps?: any[];

  /**
   * @see {OnClick}
   */
  onClick?: OnClick;

  /**
   * Dependencies for onClick
   */
  onClickDeps?: any[];

  /**
   * @see {OnCompositionEnd}
   */
  onCompositionEnd?: OnCompositionEnd;

  /**
   * Dependencies for onCompositionEnd
   */
  onCompositionEndDeps?: any[];

  /**
   * @see {OnCompositionUpdate}
   */
  onCompositionUpdate?: OnCompositionUpdate;

  /**
   * Dependencies for onCompositionUpdate
   */
  onCompositionUpdateDeps?: any[];

  /**
   * @see {OnCompositionStart}
   */
  onCompositionStart?: OnCompositionStart;

  /**
   * Dependencies for onCompositionStart
   */
  onCompositionStartDeps?: any[];

  /**
   * @see {OnCopy}
   */
  onCopy?: OnCopy;

  /**
   * Dependencies for onCopy
   */
  onCopyDeps?: any[];

  /**
   * @see {OnCut}
   */
  onCut?: OnCut;

  /**
   * Dependencies for onCut
   */
  onCutDeps?: any[];

  /**
   * @see {OnDragOver}
   */
  onDragOver?: OnDragOver;

  /**
   * Dependencies for onDragOver
   */
  onDragOverDeps?: any[];

  /**
   * @see {OnDragStart}
   */
  onDragStart?: OnDragStart;

  /**
   * Dependencies for onDragStart
   */
  onDragStartDeps?: any[];

  /**
   * @see {OnDrop}
   */
  onDrop?: OnDrop;

  /**
   * Dependencies for onDrop
   */
  onDropDeps?: any[];

  /**
   * @see {OnFocus}
   */
  onFocus?: OnFocus;

  /**
   * Dependencies for onFocus
   */
  onFocusDeps?: any[];

  /**
   * @see {OnPaste}
   */
  onPaste?: OnPaste;

  /**
   * Dependencies for onPaste
   */
  onPasteDeps?: any[];
}
