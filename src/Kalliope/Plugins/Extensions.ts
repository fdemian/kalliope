import {PagesReactExtension} from './PagesReactExtension';
import {KalliopeAutoLinkExtension} from './Extensions/AutoLinkExtension';
import {CodeHighlightExtension} from './Extensions/CodeHighlightExtension';
import CollapsibleExtension from "./Extensions/CollapsibleExtension"
import { FigmaExtension } from "./Extensions/FigmaExtension";
import { TwitterExtension } from "./Extensions/TwitterExtension";
import {VideoExtension} from "./Extensions/VideoExtension";
import { KalliopeDomRenderExtension } from "./Extensions/DomRenderExtension";
import { LayoutExtension } from './Extensions/LayoutExtension';
import { PageBreakExtension } from './Extensions/PageBreakExtension';
import {
  $defaultShouldInsertAfter,
  AutoFocusExtension,
  ClearEditorExtension,
  ClickAfterLastBlockExtension,
  DecoratorTextExtension,
  HorizontalRuleExtension,
  SelectionAlwaysOnDisplayExtension,
  SelectBlockExtension,
  TabIndentationExtension,
} from '@lexical/extension';
import {
  configExtension,
  defineExtension,
} from 'lexical';
import {
  RichTextExtension
} from '@lexical/rich-text';
import {$isCodeNode} from '@lexical/code';

const buildExtensions = (nodes:any, theme:any) => {


  // These are only enabled for rich-text mode
  const PlaygroundRichTextExtension = /* @__PURE__ */ defineExtension({
    dependencies: [
      /* @__PURE__ */ configExtension(RichTextExtension, {
        escapeFormatTriggers: {
          code: {arrow: true, click: true, enter: true, onlyAtBoundary: true},
        },
      }),
      // Each node extension below registers its own DOM-import rules — the
      // framework nodes (rich-text, list, table, code) and the playground block
      // hosts (Card, PullQuote, Review) alike — so the rich-text importer set
      // tracks this node set automatically (kept out of the always-on
      // PlaygroundImportExtension so plain-text mode doesn't pull in
      // RichTextExtension, which conflicts with PlainTextExtension).
      /* @__PURE__ configExtension(TableExtension, {
        hasStickyScrollbar: true,
      }), */
      KalliopeAutoLinkExtension,
      /*ImagesExtension,*/
      HorizontalRuleExtension,
      TwitterExtension,
      VideoExtension,
      PageBreakExtension,/*
      YouTubeExtension,
      TabFocusExtension,*/
      CollapsibleExtension,
      FigmaExtension,
      CodeHighlightExtension,
      /* @__PURE__  configExtension(ListExtension, {
        shouldPreserveNumbering: false,
      }),*/
      /*CheckListExtension,
      PlaygroundMarkdownShortcutsExtension,
      */
      PagesReactExtension,
      /*PollExtension,
      EquationsExtension,
      */
      LayoutExtension,
      /*
      ExcalidrawExtension,
      CardExtension,
      ReactReviewExtension,
      ReactFindReplaceExtension,
      PullQuoteExtension,
      RubyExtension,*/
      HorizontalRuleExtension,
      /* @__PURE__ configExtension(ListExtension, {
        shouldPreserveNumbering: false,
      }),*/
      PagesReactExtension
      /* @__PURE__  configExtension(TabIndentationExtension, {maxIndent: 7}),*/
    ],
    name: '@lexical/playground/RichText',
  });

  const AppExtension = /* @__PURE__ */ defineExtension({
    dependencies: [
      AutoFocusExtension,
      ClearEditorExtension,
      DecoratorTextExtension,
      SelectionAlwaysOnDisplayExtension,
      // Exposes editor.isEditable() as a signal; consumed by
      // registerSettingsSynchronization to drive ClickableLinkExtension.
      /*WatchEditableExtension,
      HistoryExtension,
      HistoryAnnounceExtension,
      EditorModeAnnounceExtension,
      KeywordsExtension,
      HashtagExtension,
      DateTimeExtension,
      MaxLengthExtension,
      SpecialTextExtension,
      DragDropPasteExtension,
      EmojisExtension,
      MentionsExtension,*/
      /* @__PURE__ configExtension(LinkExtension, {validateUrl}),
      KallioopeAutoLinkExtension,
      /* @__PURE__ configExtension(ClickableLinkExtension, {newTab: true}),
      SelectionAlwaysOnDisplayExtension,
      /* @__PURE__ configExtension(SelectBlockExtension, {
        cascadeSelection: true,
      }), */
      /*TerseExportExtension,*/
      /* @__PURE__ */ configExtension(ClickAfterLastBlockExtension, {
        $shouldInsertAfter: node =>
          $defaultShouldInsertAfter(node) || $isCodeNode(node),
      }),
      SelectBlockExtension,
      TabIndentationExtension,
      /* @__PURE__  configExtension(VisibleNonPrintingExtension, {
        disabled: true,
      }),*/
      // DOMImportExtension pipeline — `PlaygroundImportExtension` bundles
      // the shared `CoreImportExtension` baseline, the playground-specific
      // inline-style overlay and the `ClipboardDOMImportExtension` paste
      // handler. Per-node import rules ride along with each node extension.
      /*PlaygroundImportExtension,
      // Replaces the legacy `buildHTMLConfig().export` overrides.
      */
      KalliopeDomRenderExtension,
      /*
      FocusTrapExtension,
      RovingTabIndexExtension,
      FocusManagerExtension,*/
    ],
    name: '@lexical/playground',
    namespace: 'Playground',
    nodes,
    theme
  });

  return  [
      AppExtension,
      PlaygroundRichTextExtension,
    ];
};

export default buildExtensions;
