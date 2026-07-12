import {PagesReactExtension} from './PagesReactExtension';
import {
  $defaultShouldInsertAfter,
  AutoFocusExtension,
  ClearEditorExtension,
  ClickAfterLastBlockExtension,
  DecoratorTextExtension,
  HorizontalRuleExtension,
  SelectionAlwaysOnDisplayExtension,
} from '@lexical/extension';
import {
  configExtension,
  defineExtension,
} from 'lexical';
/*import {
  RichTextExtension
} from '@lexical/rich-text';*/
import {$isCodeNode} from '@lexical/code';

const buildExtensions = () => {

  // These are only enabled for rich-text mode
  const PlaygroundRichTextExtension = /* @__PURE__ */ defineExtension({
    dependencies: [
      /* @__PURE__ configExtension(RichTextExtension, {
        escapeFormatTriggers: {
          code: {arrow: true, click: true, enter: true, onlyAtBoundary: true},
        },
      }),*/
      // Each node extension below registers its own DOM-import rules — the
      // framework nodes (rich-text, list, table, code) and the playground block
      // hosts (Card, PullQuote, Review) alike — so the rich-text importer set
      // tracks this node set automatically (kept out of the always-on
      // PlaygroundImportExtension so plain-text mode doesn't pull in
      // RichTextExtension, which conflicts with PlainTextExtension)
      HorizontalRuleExtension,
      /* @__PURE__ configExtension(ListExtension, {
        shouldPreserveNumbering: false,
      }),*/
      PagesReactExtension
    ],
    name: '@lexical/playground/RichText',
  });

  const AppExtension = /* @__PURE__ */ defineExtension({
    dependencies: [
      AutoFocusExtension,
      ClearEditorExtension,
      DecoratorTextExtension,
      SelectionAlwaysOnDisplayExtension,
      /* @__PURE__ */ configExtension(ClickAfterLastBlockExtension, {
        $shouldInsertAfter: node =>
          $defaultShouldInsertAfter(node) || $isCodeNode(node),
      }),
    ],
    name: '@lexical/playground',
    namespace: 'Playground',
    // nodes: PlaygroundNodes,
    // theme: PlaygroundEditorTheme,
  });

  return  [
      AppExtension,
      PlaygroundRichTextExtension,
    ];
};

export default buildExtensions;
