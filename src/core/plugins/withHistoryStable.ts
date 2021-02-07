import { HistoryEditor, withHistory } from 'slate-history';
import { SlatePlugin } from '..';

/**
 * Rewrite of with history to support plugins that can be applied multiple times.
 * @param editor the slate plugin editor singleton
 */
export const withHistoryStable: SlatePlugin = editor => {
  // if the editor already has history
  if (HistoryEditor.isHistoryEditor(editor)) {
    // get the current stored state from the editor
    const { history } = editor;
    // reapply the plugin
    // when we reapply the plugin a blank history is created
    const editorWithHistory: HistoryEditor = withHistory(editor);
    // reattach our stored state
    editorWithHistory.history = history;
    return editorWithHistory;
  } else {
    // we don't have any history so simply reapply
    return withHistory(editor);
  }
};
