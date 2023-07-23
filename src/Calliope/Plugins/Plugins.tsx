import { lazy } from 'react';
import { useSharedHistoryContext } from '../historyContext';
import {
  CalliopeFormatTypes,
  EditorRefType
} from '../CalliopeEditorTypes';
import type { EditorState } from 'lexical';
import { ClearEditorPlugin } from '@lexical/react/LexicalClearEditorPlugin';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin';
import FloatingLinkEditorPlugin from './FloatingLinkEditorPlugin/index';
import TableCellActionMenuPlugin from './TableActionMenuPlugin';
import CodeActionMenuPlugin from './CodeActionMenuPlugin/index';
import DraggableBlockPlugin from './DraggableBlockPlugin';
import CollapsiblePlugin from './CollapsiblePlugin';
import MentionsPlugin from './Mentions/MentionsPlugin';
import DragDropPastePlugin from './DragDropPastePlugin/index';

//
const EquationsPlugin = lazy(() => import('./EquationsPlugin'));
const EditorRefPlugin = lazy(() => import('./EditorRefPlugin'));
const ListMaxIndentLevelPlugin = lazy(() => import('./ListMaxIndentLevelPlugin'));
const EmojisPlugin = lazy(() => import('./Emoji/EmojiPickerPlugin'));
const SetFormatPlugin = lazy(() => import('./SetFormatPlugin'));
const KeyboardPlugin = lazy(() => import('./KeyboardPlugin'));
const SpoilerPlugin = lazy(() => import('./SpoilerPlugin'));
const ClickableLinkPlugin = lazy(() => import('./ClickableLinkPlugin'));
const CodeHighlightPlugin = lazy(() => import('./CodeHighlightPlugin'));
const ImagesPlugin = lazy(() => import('./ImagesPlugin'));
const TwitterPlugin = lazy(() => import('./TwitterPlugin'));
const TableCellResizer = lazy(() => import('./TableCellResizer/index'));
const VideoPlugin = lazy(() => import('./VideoPlugin'));
const ExcalidrawPlugin = lazy(() => import('./ExcalidrawPlugin'));
const SpeechToTextPlugin = lazy(() => import('./SpeechToTextPlugin'));
const CitePlugin = lazy(() => import('./CitePlugin'));
const MarkdownShortcutPlugin = lazy(() => import('./MarkdownShortcut'));
const InlineImagePlugin = lazy(() => import('./InlineImagePlugin'));

export type PluginComponentProps = {
  setFormats: (formats: CalliopeFormatTypes) => void;
  internalFormat: CalliopeFormatTypes;
  setInternalFormat: (formats: CalliopeFormatTypes) => void;
  isSmallWidthViewport: boolean;
  editorRef: EditorRefType;
  setEditorRef: (editor: EditorRefType) => void;
  onEditorChange: (editorState: EditorState) => void;
  floatingAnchorElem: HTMLDivElement | null;
  config: any;
  readOnly: boolean;
};

function EditorPlugins({
  setFormats,
  internalFormat,
  setInternalFormat,
  setEditorRef,
  onEditorChange,
  config,
  readOnly,
  floatingAnchorElem,
  isSmallWidthViewport,
}: PluginComponentProps): JSX.Element {
  const { historyState } = useSharedHistoryContext();

  return (
    <>
      {floatingAnchorElem && !isSmallWidthViewport && (
        <>
          <CodeActionMenuPlugin anchorElem={floatingAnchorElem} />
          <TableCellActionMenuPlugin anchorElem={floatingAnchorElem} cellMerge={true} />
          <DraggableBlockPlugin anchorElem={floatingAnchorElem} />
        </>
      )}
      {floatingAnchorElem && <FloatingLinkEditorPlugin anchorElem={floatingAnchorElem} /> }
      <DragDropPastePlugin />
      <HistoryPlugin externalHistoryState={historyState} />
      {config.autoFocus && <AutoFocusPlugin />}
      <EmojisPlugin />
      <ClearEditorPlugin />
      <CodeHighlightPlugin />
      <ListMaxIndentLevelPlugin maxDepth={7} />
      <LinkPlugin />
      <ListPlugin />
      <CheckListPlugin />
      <EquationsPlugin />
      <TablePlugin />
      <TableCellResizer />
      <ImagesPlugin />
      <InlineImagePlugin />
      {!readOnly && (
        <SetFormatPlugin
          internalFormat={internalFormat}
          setInternalFormat={setInternalFormat}
          setFormats={setFormats}
        />
      )}
      <OnChangePlugin onChange={onEditorChange} />
      <HistoryPlugin />
      <AutoFocusPlugin />
      <KeyboardPlugin />
      <HorizontalRulePlugin />
      <SpoilerPlugin />
      <ClickableLinkPlugin />
      <CollapsiblePlugin />
      <MarkdownShortcutPlugin />
      <TwitterPlugin />
      <ExcalidrawPlugin />
      <VideoPlugin />
      <CitePlugin />
      <ClearEditorPlugin />
      <SpeechToTextPlugin />
      <MentionsPlugin config={config.mentions} />
      <EditorRefPlugin setEditorRef={setEditorRef} />
    </>
  );
}

export default EditorPlugins;
