import {
  $getNodeByKey,
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  DEPRECATED_$isGridSelection,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  INDENT_CONTENT_COMMAND,
  OUTDENT_CONTENT_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
} from 'lexical';
import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/react/LexicalHorizontalRuleNode';
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
import { $createHeadingNode, $createQuoteNode, HeadingTagType } from '@lexical/rich-text';
import { TOGGLE_LINK_COMMAND } from '@lexical/link';
import { INSERT_TABLE_COMMAND } from '@lexical/table';
import { INSERT_KEYBOARD_COMMAND } from './KeyboardPlugin';
import { INSERT_SPOILER_COMMAND } from './SpoilerPlugin';
import { INSERT_IMAGE_COMMAND } from './ImagesPlugin';
import { INSERT_INLINE_IMAGE_COMMAND } from './InlineImagePlugin';
import { INSERT_TWEET_COMMAND } from './TwitterPlugin';
import { INSERT_EQUATION_COMMAND } from './EquationsPlugin';
import { INSERT_VIDEO_COMMAND } from './VideoPlugin';
import { INSERT_EXCALIDRAW_COMMAND } from './ExcalidrawPlugin';
import { SPEECH_TO_TEXT_COMMAND } from './SpeechToTextPlugin';
import { INSERT_CITE_QUOTE } from './CitePlugin';
import { INSERT_COLLAPSIBLE_COMMAND } from './CollapsiblePlugin';
import { EditorCommands } from '../KalliopeEditorTypes';
import type { LexicalEditor } from 'lexical';
import { CalliopeFormatTypes } from '../KalliopeEditorTypes';

type LexicalEditorRef = {
  current: LexicalEditor;
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

      if ($isRangeSelection(selection) || DEPRECATED_$isGridSelection(selection)) {
        if (selection.isCollapsed()) {
          $setBlocksType(selection, () => $createCodeNode());
        } else {
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

const applyStyleText = (styles: Record<string, string>, editor: LexicalEditorRef) => {
  editor.current.update(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      $patchStyleText(selection, styles);
    }
  });
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
    name: 'INSERT_RULE',
    command: INSERT_HORIZONTAL_RULE_COMMAND,
    directCommand: true,
  },
  {
    name: 'INSERT_IMAGE',
    command: INSERT_IMAGE_COMMAND,
    directCommand: true,
  },
  {
    name: 'INSERT_IMAGE_INLINE',
    command: INSERT_INLINE_IMAGE_COMMAND,
    directCommand: true
  },
  {
    name: 'INSERT_TWEET',
    command: INSERT_TWEET_COMMAND,
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
];

export default EDITOR_COMMANDS;
