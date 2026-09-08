import {
  $addUpdateTag,
  $createParagraphNode,
  $createRangeSelection,
  $getSelection,
  $isElementNode,
  $isLineBreakNode,
  $isParagraphNode,
  $isRangeSelection,
  $isTextNode,
  $setSelection,
  $splitNode,
  LexicalNode,
  ElementNode,
  NodeKey,
  RangeSelection,
  $getNodeByKey,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  INDENT_CONTENT_COMMAND,
  OUTDENT_CONTENT_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
  SKIP_DOM_SELECTION_TAG,
  $getCaretRangeInDirection,
  $caretRangeFromSelection,
  $getChildCaret,
  $getCaretInDirection,
  $comparePointCaretNext,
  $normalizeCaret,
  $isDecoratorNode,
  type CaretRange,
} from 'lexical';
import {$isDecoratorBlockNode} from '@lexical/react/LexicalDecoratorBlockNode';
import {
  $patchStyleText,
  $setBlocksType,
} from '@lexical/selection';
import { $createCodeNode, $isCodeNode } from '@lexical/code';
import {
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from '@lexical/list';
import {
  $getNearestBlockElementAncestorOrThrow,
} from '@lexical/utils';
import {
  $isHeadingNode,
  $isQuoteNode
} from '@lexical/rich-text';
import { $createHeadingNode, $createQuoteNode, HeadingTagType } from '@lexical/rich-text';
import { TOGGLE_LINK_COMMAND } from '@lexical/link';
import { INSERT_TABLE_COMMAND, $isTableSelection } from '@lexical/table';

// Load custom commands.
import { INSERT_KEYBOARD_COMMAND } from './Keyboard/KeyboardCommand';
import { INSERT_SPOILER_COMMAND } from './Spoiler/SpoilerCommand';
import { INSERT_IMAGE_COMMAND } from './ImagesPlugin/ImagesCommand';
import { INSERT_TWEET_COMMAND } from './Extensions/TwitterExtension';
import { INSERT_INSTAGRAM_COMMAND } from './Instagram/InstagramCommands';
import { INSERT_EQUATION_COMMAND } from './Extensions/EquationsExtension';
import { INSERT_EXCALIDRAW_COMMAND } from './Excalidraw/ExcalidrawCommand';
import { SPEECH_TO_TEXT_COMMAND } from './SpeechToText/SpeechToTextCommand';
import { INSERT_CITE_QUOTE } from './Cite/CiteCommand';
import { INSERT_COLLAPSIBLE_COMMAND } from './Extensions/CollapsibleExtension';
import { INSERT_PAGE_BREAK } from  './Extensions/PageBreakExtension';
//import { INSERT_LAYOUT_COMMAND } from './Layout/LayoutCommand';
import { INSERT_FIGMA_COMMAND } from './Extensions/FigmaExtension';
import { INSERT_VIDEO_COMMAND } from './Extensions/VideoExtension';

import { EditorCommands } from '../KalliopeEditorTypes';
import type { LexicalEditor } from 'lexical';
import { CalliopeFormatTypes } from '../KalliopeEditorTypes';
import {$setPageSetup, DEFAULT_PAGE_SETUP, type PageSetup} from "./PagesExtension";

type LexicalEditorRef = {
  current: LexicalEditor;
};

//============================= //

/**
 * A node that can occupy a named slot, implemented by {@link ElementNode} and
 * {@link DecoratorNode}. Its up-pointer is `__slotHost` rather than `__parent`
 * (the two are mutually exclusive), so the slot boundary behaves like a shadow
 * root.
 *
 * @experimental
 */
export interface SlotChildNode {
  /** @internal */
  __slotHost: null | NodeKey;
}

/**
 * Shape predicate: true when `node` carries the child's `__slotHost` field —
 * i.e. it is an {@link ElementNode} or a {@link DecoratorNode}. Narrows to
 * {@link SlotChildNode}. This is a type guard only; {@link $setSlot} rejects
 * inline values at runtime. The slot link acts as a virtual shadow root, so
 * any non-inline block — shadow root or not — can occupy a slot.
 *
 * @experimental
 */
export function $isSlotChild(
  node: LexicalNode,
): node is LexicalNode & SlotChildNode {
  return $isElementNode(node) || $isDecoratorNode(node);
}

/**
 * Returns the key of the host this node is slotted into, or null when the node
 * is not slotted. Accepts any node and narrows internally so generic callers
 * (removal guard, up-walk, GC, caret) don't have to. Exposes a raw key, so it
 * stays internal to the package; public callers use {@link $getSlotHost}.
 *
 * @internal
 */
export function $getSlotHostKey(node: LexicalNode): null | NodeKey {
  const latest = node.getLatest();
  return $isSlotChild(latest) ? latest.__slotHost : null;
}


/**
 * Returns the slot value (the "slot frame") whose isolated subtree contains
 * `node`, or `node` itself when it is a slot value, or null when the node is
 * not inside any slot. The walk follows `getParent()` and naturally stops at a
 * slot value because a slotted node's `__parent` is null. Non-slot trees have
 * `__slotHost === null` everywhere, so this always returns null there.
 *
 * Selection-driven exporters use this to find the isolated subtree a
 * RangeSelection lives in (a selection inside a slot never contains the host,
 * so a root-children walk alone would miss it).
 *
 * @experimental
 */
export function $getSlotFrame(node: LexicalNode): LexicalNode | null {
  let current: LexicalNode | null = node.getLatest();
  while (current !== null) {
    if ($getSlotHostKey(current) !== null) {
      return current;
    }
    current = current.getParent();
  }
  return null;
}

//============================= //


/**
 * Checks whether the selection covers the entire block: the selection's
 * start point is at or before the first position inside blockNode and its
 * end point is at or after the last position inside blockNode. A selection
 * that extends beyond the block's boundaries still fully selects the block,
 * and an empty block is fully selected by any selection that touches or
 * surrounds it.
 *
 * @param blockNode - The ElementNode to check, typically a top-level block or the RootNode
 * @param selectionOrRange - The RangeSelection or CaretRange to check
 * @returns true if the selection covers the entire blockNode
 */
export function $isBlockFullySelected(
  blockNode: ElementNode,
  selectionOrRange: RangeSelection | CaretRange,
): boolean {
  const range = $getCaretRangeInDirection(
    $isRangeSelection(selectionOrRange)
      ? $caretRangeFromSelection(selectionOrRange)
      : selectionOrRange,
    'next',
  );
  // A named-slot subtree is isolated from its host through a parentless
  // up-link, so a range inside a slot can never cover a block outside that
  // slot frame (and vice versa) — and the caret comparison below has no
  // common ancestor to walk across the boundary. Different frames are
  // never fully selected; the same frame compares safely within it.
  const anchorFrame = $getSlotFrame(range.anchor.origin);
  const blockFrame = $getSlotFrame(blockNode.getLatest());
  if (
    anchorFrame === null ? blockFrame !== null : !anchorFrame.is(blockFrame)
  ) {
    return false;
  }
  const blockStart = $normalizeCaret($getChildCaret(blockNode, 'next'));
  const blockEnd = $getCaretInDirection(
    $normalizeCaret($getChildCaret(blockNode, 'previous')),
    'next',
  );
  return (
    $comparePointCaretNext(range.anchor, blockStart) <= 0 &&
    $comparePointCaretNext(range.focus, blockEnd) >= 0
  );
}

function $splitParagraphsByLineBreaks(selection: RangeSelection): void {
  const blocks: Set<ElementNode> = new Set();
  for (const node of selection.getNodes()) {
    const block = $isParagraphNode(node) ? node : $findParagraphParent(node);
    if (block !== null) {
      blocks.add(block);
    }
  }
  for (const point of [selection.anchor, selection.focus]) {
    const block = $findParagraphParent(point.getNode());
    if (block !== null) {
      blocks.add(block);
    }
  }

  const anchorKey = selection.anchor.key;
  const anchorOffset = selection.anchor.offset;
  const anchorType = selection.anchor.type;
  const focusKey = selection.focus.key;
  const focusOffset = selection.focus.offset;
  const focusType = selection.focus.type;

  for (const block of blocks) {
    const children = block.getChildren();
    const lbIndices: number[] = [];
    for (let i = 0; i < children.length; i++) {
      if ($isLineBreakNode(children[i])) {
        lbIndices.push(i);
      }
    }
    if (lbIndices.length === 0) {
      continue;
    }
    for (let j = lbIndices.length - 1; j >= 0; j--) {
      const [, rightBlock] = $splitNode(block, lbIndices[j]);
      const firstChild = rightBlock.getFirstChild();
      if ($isLineBreakNode(firstChild)) {
        firstChild.remove();
      }
    }
  }

  const newSelection = $createRangeSelection();
  newSelection.anchor.set(anchorKey, anchorOffset, anchorType);
  newSelection.focus.set(focusKey, focusOffset, focusType);
  $setSelection(newSelection);
}

function $findParagraphParent(node: LexicalNode): ElementNode | null {
  if ($isParagraphNode(node)) {
    return node;
  }
  const parent = node.getParent();
  return $isElementNode(parent) && $isParagraphNode(parent) ? parent : null;
}

function $clearBlockFormat(block: ElementNode): void {
  if (block.getFormat() !== 0) {
    block.setFormat('');
  }
  if (block.getIndent() !== 0) {
    block.setIndent(0);
  }
}

export const setPageSize = (editor: { current: LexicalEditor }, v: null | Partial<PageSetup>) => {
  editor.current.update(() => {
    $setPageSetup(
      v ? (prev) => ({...(prev || DEFAULT_PAGE_SETUP), ...v}) : v,
    );
  });
}

export const clearFormatting = (
  editor: { current: LexicalEditor },
  skipRefocus: boolean = false,
) => {
  const currentEditor:LexicalEditor = editor.current;
  currentEditor.update(() => {
    if (skipRefocus) {
      $addUpdateTag(SKIP_DOM_SELECTION_TAG);
    }
    const selection = $getSelection();
    if ($isRangeSelection(selection) || $isTableSelection(selection)) {
      const anchor = selection.anchor;
      const focus = selection.focus;
      const extractedNodes = selection.extract();

      if (anchor.key === focus.key && anchor.offset === focus.offset) {
        $clearBlockFormat(
          $getNearestBlockElementAncestorOrThrow(anchor.getNode()),
        );
        return;
      }

      // Determine which blocks are fully selected before making any
      // changes, since the mutations below (such as replacing a
      // HeadingNode with a ParagraphNode) would detach nodes that the
      // selection's carets may refer to
      const postExtractSelection = $getSelection();
      let fullySelectedBlocks: null | Set<NodeKey> = null;
      if ($isRangeSelection(postExtractSelection)) {
        fullySelectedBlocks = new Set();
        for (const node of extractedNodes) {
          if ($isTextNode(node)) {
            const block = $getNearestBlockElementAncestorOrThrow(node);
            if (
              !fullySelectedBlocks.has(block.getKey()) &&
              $isBlockFullySelected(block, postExtractSelection)
            ) {
              fullySelectedBlocks.add(block.getKey());
            }
          }
        }
      }

      extractedNodes.forEach(node => {
        if ($isTextNode(node)) {
          if (node.getStyle() !== '') {
            node.setStyle('');
          }
          if (node.getFormat() !== 0) {
            node.setFormat(0);
          }
          const nearestBlockElement =
            $getNearestBlockElementAncestorOrThrow(node);
          if (
            fullySelectedBlocks === null ||
            fullySelectedBlocks.has(nearestBlockElement.getKey())
          ) {
            $clearBlockFormat(nearestBlockElement);
          }
        } else if ($isHeadingNode(node) || $isQuoteNode(node)) {
          node.replace($createParagraphNode(), true);
        } else if ($isDecoratorBlockNode(node)) {
          node.setFormat('');
        }
      });
    }
  });
};


const onCodeLanguageSelect = (editor: LexicalEditorRef, value: string) => {
  editor.current.update(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();
      const elementKey = element.getKey();

      if (elementKey !== null) {
        const node = $getNodeByKey(elementKey);
        if ($isCodeNode(node)) {
          node.setLanguage(value);
        }
      }
    }
  });
};

const formatParagraph = (editor: LexicalEditorRef, internalFormat: CalliopeFormatTypes) => {
  if (internalFormat.blockType !== 'paragraph') {
    editor.current.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
  }
};

const formatHeading = (editor: LexicalEditorRef, internalFormat: CalliopeFormatTypes, headingSize: HeadingTagType) => {
  if (internalFormat.blockType !== headingSize) {
    editor.current.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(headingSize));
      }
    });
  }
};

const formatBulletList = (editor: LexicalEditorRef, internalFormat: CalliopeFormatTypes) => {
  if (internalFormat.blockType !== 'bullet') {
    editor.current.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
  } else {
    editor.current.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
  }
};

const formatCheckList = (editor: LexicalEditorRef, internalFormat: CalliopeFormatTypes) => {
  if (internalFormat.blockType !== 'check') {
    editor.current.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
  } else {
    editor.current.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
  }
};

const formatNumberedList = (editor: LexicalEditorRef, internalFormat: CalliopeFormatTypes) => {
  if (internalFormat.blockType !== 'number') {
    editor.current.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
  } else {
    editor.current.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
  }
};

const formatQuote = (editor: LexicalEditorRef, internalFormat:CalliopeFormatTypes) => {
  if (internalFormat.blockType !== 'quote') {
    editor.current.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createQuoteNode());
      }
    });
  }
};

const formatCode = (editor: LexicalEditorRef, internalFormat: CalliopeFormatTypes) => {
  if (internalFormat.blockType !== 'code') {
    editor.current.update(() => {
      let selection = $getSelection();

      if ($isRangeSelection(selection) || $isTableSelection(selection)) {
        if (selection.isCollapsed()) {
          $setBlocksType(selection, () => $createCodeNode());
        } else {
          selection = $getSelection();
          if (!$isRangeSelection(selection)) {
            return;
          }
          $splitParagraphsByLineBreaks(selection);
          const textContent = selection.getTextContent();
          const codeNode = $createCodeNode();
          selection.insertNodes([codeNode]);
          selection = $getSelection();
          if ($isRangeSelection(selection)) selection.insertRawText(textContent);
        }
      }
    });
  }
};

const applyStyleText = (styles: Record<string, string>, editor: LexicalEditorRef, skipHistoryStack?: boolean) => {
  editor.current.update(
    () => {
      const selection = $getSelection();
      if (selection !== null) {
        $patchStyleText(selection, styles);
      }
    },
    skipHistoryStack ? {tag: 'historic'} : {},
  );
};

// @ts-ignore
const selectFontFamily = (editor:LexicalEditorRef, _, family:string) => {
  return applyStyleText({ 'font-family': family }, editor);
};

// @ts-ignore
const selectFontSize = (editor: LexicalEditorRef, _, fontSize: string) => {
  return applyStyleText({ 'font-size': fontSize }, editor);
};

// @ts-ignore
const selectFontColor = (editor: LexicalEditorRef, _, color: string) => {
  return applyStyleText({ color }, editor);
};

// @ts-ignore
const selectBGColor = (editor: LexicalEditorRef, _, bgColor: string) => {
  return applyStyleText({ 'background-color': bgColor }, editor);
};

const EDITOR_COMMANDS: EditorCommands = [
  {
    name: 'UNDO',
    command: UNDO_COMMAND,
    directCommand: true,
  },
  {
    name: 'REDO',
    command: REDO_COMMAND,
    directCommand: true,
  },
  {
    name: 'FORMAT',
    command: FORMAT_TEXT_COMMAND,
    directCommand: true,
  },
  {
    name: 'KEYBOARD',
    command: INSERT_KEYBOARD_COMMAND,
    directCommand: true,
  },
  {
    name: 'SPOILER',
    command: INSERT_SPOILER_COMMAND,
    directCommand: true,
  },
  {
    name: 'LINK',
    command: TOGGLE_LINK_COMMAND,
    directCommand: true,
  },
  {
    /* left, center, right justify */
    name: 'ALIGN',
    command: FORMAT_ELEMENT_COMMAND,
    directCommand: true,
  },
  {
    name: 'INDENT',
    command: INDENT_CONTENT_COMMAND,
    directCommand: true,
  },
  {
    name: 'OUTDENT',
    command: OUTDENT_CONTENT_COMMAND,
    directCommand: true,
  },
  {
    name: 'PARAGRAPH',
    command: formatParagraph,
    directCommand: false,
  },
  {
    name: 'BULLET_LIST',
    command: formatBulletList,
    directCommand: false,
  },
  {
    name: 'NUMBERED_LIST',
    command: formatNumberedList,
    directCommand: false,
  },
  {
    name: 'CHECK',
    command: formatCheckList,
    directCommand: false,
  },
  {
    name: 'H1',
    command: (editor: LexicalEditorRef, formats: CalliopeFormatTypes) => formatHeading(editor, formats, 'h1'),
    directCommand: false,
  },
  {
    name: 'H2',
    command: (editor: LexicalEditorRef, formats: CalliopeFormatTypes) => formatHeading(editor, formats, 'h2'),
    directCommand: false,
  },
  {
    name: 'H3',
    command: (editor: LexicalEditorRef, formats: CalliopeFormatTypes) => formatHeading(editor, formats, 'h3'),
    directCommand: false,
  },
  {
    name: 'QUOTE',
    command: formatQuote,
    directCommand: false,
  },
  {
    name: 'CODE_BLOCK',
    command: formatCode,
    directCommand: false,
  },
  {
    name: 'CHANGE_FONT',
    command: selectFontFamily,
    directCommand: false,
  },
  {
    name: 'CHANGE_FONT_SIZE',
    command: selectFontSize,
    directCommand: false,
  },
  {
    name: 'CHANGE_FONT_COLOR',
    command: selectFontColor,
    directCommand: false,
  },
  {
    name: 'CHANGE_FONT_BG_COLOR',
    command: selectBGColor,
    directCommand: false,
  },
  {
    name: "CLEAR_FORMATTING",
    command: clearFormatting,
    directCommand: false,
  },
  {
    name: "SET_PAGE_SETUP",
    command: setPageSize,
    directCommand: false,
  },
  {
    name: 'INSERT_IMAGE',
    command: INSERT_IMAGE_COMMAND,
    directCommand: true,
  },
  {
    name: 'INSERT_TWEET',
    command: INSERT_TWEET_COMMAND,
    directCommand: true,
  },
  {
    name: 'INSERT_INSTAGRAM_POST',
    command: INSERT_INSTAGRAM_COMMAND,
    directCommand: true,
  },
  {
    name: 'INSERT_TABLE',
    command: INSERT_TABLE_COMMAND,
    directCommand: true,
  },
  {
    name: 'INSERT_EQUATION',
    command: INSERT_EQUATION_COMMAND,
    directCommand: true,
  },
  {
    name: 'INSERT_VIDEO',
    command: INSERT_VIDEO_COMMAND,
    directCommand: true,
  },
  {
    name: 'INSERT_EXCALIDRAW',
    command: INSERT_EXCALIDRAW_COMMAND,
    directCommand: true,
  },
  {
    name: 'INSERT_BLOCK_SPOILER',
    command: INSERT_COLLAPSIBLE_COMMAND,
    directCommand: true,
  },
  {
    name: 'CODE_LANGUAGE_CHANGE',
    // @ts-ignore
    command: (editor: LexicalEditor, formats:any, val: string) => onCodeLanguageSelect(editor, val),
    directCommand: false,
  },
  {
    name: 'SPEECH_TO_TEXT',
    command: SPEECH_TO_TEXT_COMMAND,
    directCommand: true,
  },
  {
    name: 'INSERT_CITE_QUOTE',
    command: INSERT_CITE_QUOTE,
    directCommand: true,
  },
  {
    name: 'INSERT_PAGE_BREAK',
    command: INSERT_PAGE_BREAK,
    directCommand: true,
  },
  /*{
    name: 'INSERT_LAYOUT_COMMAND',
    command: INSERT_LAYOUT_COMMAND,
    directCommand: true
  },*/
  {
    name: "INSERT_FIGMA_COMMAND",
    command: INSERT_FIGMA_COMMAND,
    directCommand: true
  }
];

export default EDITOR_COMMANDS;
