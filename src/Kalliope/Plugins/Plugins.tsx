import { lazy, useState } from 'react';
import { useSharedHistoryContext } from '../historyContext';
import { CalliopeFormatTypes } from '../KalliopeEditorTypes';
import type { EditorState } from 'lexical';
import { EditorRefPlugin } from '@lexical/react/LexicalEditorRefPlugin';
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
import TableHoverActionsPlugin from './TableHoverActionsPlugin';

//
const PageBreakPlugin = lazy(() => import( './PageBreak/PageBreakPlugin'));
const EquationsPlugin = lazy(() => import('./Equations/EquationsPlugin'));
const ListMaxIndentLevelPlugin = lazy(() => import('./ListMaxIndentLevelPlugin'));
const EmojisPlugin = lazy(() => import('./Emoji/EmojiPickerPlugin'));
const SetFormatPlugin = lazy(() => import('./SetFormatPlugin'));
const LayoutPlugin = lazy(() => import('./Layout/LayoutPlugin'));
const KeyboardPlugin = lazy(() => import('./Keyboard/KeyboardPlugin'));
const SpoilerPlugin = lazy(() => import('./Spoiler/SpoilerPlugin'));
const ClickableLinkPlugin = lazy(() => import('./ClickableLinkPlugin'));
const CodeHighlightPlugin = lazy(() => import('./CodeHighlightPlugin'));
const ImagesPlugin = lazy(() => import('./ImagesPlugin/ImagesPlugin'));
const TwitterPlugin = lazy(() => import('./Twitter/TwitterPlugin'));
const InstagramPlugin = lazy(() => import('./Instagram/InstagramPlugins'));
const TableCellResizer = lazy(() => import('./TableCellResizer/index'));
const VideoPlugin = lazy(() => import('./Video/VideoPlugin'));
const ExcalidrawPlugin = lazy(() => import('./Excalidraw/ExcalidrawPlugin'));
const SpeechToTextPlugin = lazy(() => import('./SpeechToText/SpeechToTextPlugin'));
const CitePlugin = lazy(() => import('./Cite/CitePlugin'));
const MarkdownShortcutPlugin = lazy(() => import('./MarkdownShortcut'));
const InlineImagePlugin = lazy(() => import('./InlineImagesPlugin/InlineImagePlugin'));
const FigmaPlugin = lazy(() => import('./Figma/FigmaPlugin'));

export type PluginComponentProps = {
  setFormats: (formats: CalliopeFormatTypes) => void;
  setCanUndo: (payload: boolean) => void;
  setCanRedo: (payload: boolean) => void;
  internalFormat: CalliopeFormatTypes;
  setInternalFormat: (formats: CalliopeFormatTypes) => void;
  isSmallWidthViewport: boolean;
  editorRef: any;
  isNestedPlugin: boolean;
  onEditorChange: (editorState: EditorState) => void;
  floatingAnchorElem: HTMLDivElement | null;
  config: any;
  readOnly: boolean;
};

function EditorPlugins({
  setFormats,
  setCanUndo,
  setCanRedo,
  internalFormat,
  setInternalFormat,
  onEditorChange,
  editorRef,
  config,
  readOnly,
  floatingAnchorElem,
  isSmallWidthViewport,
  isNestedPlugin
}: PluginComponentProps): JSX.Element {
  const { historyState } = useSharedHistoryContext();
  const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false);

  return (
    <>
      {
          !isNestedPlugin &&
          floatingAnchorElem && !isSmallWidthViewport && (
        <>
          <CodeActionMenuPlugin anchorElem={floatingAnchorElem} />
          <TableCellActionMenuPlugin anchorElem={floatingAnchorElem} cellMerge={true} />
          <DraggableBlockPlugin anchorElem={floatingAnchorElem} />
        </>
      )}
      {   !isNestedPlugin &&
          floatingAnchorElem && <FloatingLinkEditorPlugin anchorElem={floatingAnchorElem}
          isLinkEditMode={isLinkEditMode}
          setIsLinkEditMode={setIsLinkEditMode}
        />
      }
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
      <TableHoverActionsPlugin anchorElem={floatingAnchorElem} />
      <ImagesPlugin />
      <InlineImagePlugin />
      {!readOnly && (
        <SetFormatPlugin
          internalFormat={internalFormat}
          setInternalFormat={setInternalFormat}
          setFormats={setFormats}
          setCanUndo={setCanUndo}
          setCanRedo={setCanRedo}
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
      <InstagramPlugin />
      <ExcalidrawPlugin />
      <VideoPlugin />
      <CitePlugin />
      <FigmaPlugin />
      <ClearEditorPlugin />
      <SpeechToTextPlugin />
      <PageBreakPlugin />
      <LayoutPlugin />
      <MentionsPlugin config={config.mentions} />
      {!isNestedPlugin && <EditorRefPlugin editorRef={editorRef} />}
  </>
  );
}

export default EditorPlugins;
