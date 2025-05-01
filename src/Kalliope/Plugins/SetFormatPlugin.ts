import { useEffect, useCallback } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_NORMAL,
  SELECTION_CHANGE_COMMAND,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  KEY_DOWN_COMMAND,
} from 'lexical';
import type { TextNode, ElementNode, RangeSelection } from 'lexical';
import { CalliopeFormatTypes } from '../KalliopeEditorTypes';
import {sanitizeUrl} from '../utils/url';
import { $getNearestNodeOfType } from '@lexical/utils';
import { $isListNode, ListNode } from '@lexical/list';
import { $isCodeNode, CODE_LANGUAGE_MAP } from '@lexical/code';
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import { $isHeadingNode } from '@lexical/rich-text';
import {
  $isAtNodeEnd,
  $getSelectionStyleValueForProperty,
  $isParentElementRTL,
} from '@lexical/selection';
import { $isTableSelection } from '@lexical/table';

type SetFormatPluginProps = {
  internalFormat: CalliopeFormatTypes,
  setInternalFormat: (formats: CalliopeFormatTypes) => void;
  setFormats: (formats: CalliopeFormatTypes) => void;
  setCanUndo: (payload: boolean) => void;
  setCanRedo: (payload: boolean) => void;
}

function getSelectedNode(selection: RangeSelection): TextNode | ElementNode {
  const anchor = selection.anchor;
  const focus = selection.focus;
  const anchorNode = selection.anchor.getNode();
  const focusNode = selection.focus.getNode();
  if (anchorNode === focusNode) {
    return anchorNode;
  }
  const isBackward = selection.isBackward();
  if (isBackward) {
    return $isAtNodeEnd(focus) ? anchorNode : focusNode;
  } else {
    return $isAtNodeEnd(anchor) ? focusNode : anchorNode;
  }
}

const SetFormatPlugin = ({ internalFormat, setInternalFormat, setFormats, setCanUndo, setCanRedo }: SetFormatPluginProps) => {
  const [editor] = useLexicalComposerContext();

  const getEditorFormats = useCallback(() => {
    let isLink = false;
    let selectedElementKey: string = '';
    let blockType = null;
    let codeLanguage = '';

    let _formats = { ...internalFormat };
    const selection = $getSelection();

    //
    let fontSize:string = '15px';
    let fontColor:string = '#000';
    let bgColor:string = '#fff';
    let fontFamily:string = 'Arial';

    if ($isRangeSelection(selection)) {

      try {
        fontSize = $getSelectionStyleValueForProperty(selection, 'font-size', '15px');
        fontColor = $getSelectionStyleValueForProperty(selection, 'color', '#000');
        bgColor = $getSelectionStyleValueForProperty(selection, 'background-color', '#fff');
        fontFamily = $getSelectionStyleValueForProperty(selection, 'font-family', 'Arial');
      } catch {
        console.log('[ERROR] - $getSelectionStyleValueForProperty');
      }

      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();
      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);

      if (elementDOM !== null) {
        selectedElementKey = elementKey;

        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType(anchorNode, ListNode);
          const type = parentList ? parentList.getListType() : element.getListType();
          blockType = type;
        } else {
          const type = $isHeadingNode(element) ? element.getTag() : element.getType();
          blockType = type;

          if ($isCodeNode(element)) {
            const language = element.getLanguage() as keyof typeof CODE_LANGUAGE_MAP;
            codeLanguage = language ? CODE_LANGUAGE_MAP[language] || language : '';
          }
        }
      }

      // Update links
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        isLink = true;
      }

      // Update text format
      _formats = {
        ...internalFormat,
        isLink,
        blockType,
        selectedElementKey,
        codeLanguage,
        isBold: selection.hasFormat('bold'),
        isItalic: selection.hasFormat('italic'),
        isUnderline: selection.hasFormat('underline'),
        isStrikethrough: selection.hasFormat('strikethrough'),
        isSubscript: selection.hasFormat('subscript'),
        isSuperscript: selection.hasFormat('superscript'),
        isCode: selection.hasFormat('code'),
        isUppercase: selection.hasFormat('uppercase'),
        isLowercase: selection.hasFormat('lowercase'),
        isCapitalize: selection.hasFormat('capitalize'),
        isRTL: $isParentElementRTL(selection),
        fontSize,
        fontColor,
        bgColor,
        fontFamily,
      };
    }
    
    if ($isTableSelection(selection)) {
      try {
        fontSize = $getSelectionStyleValueForProperty(selection, 'font-size', '15px');
        fontColor = $getSelectionStyleValueForProperty(selection, 'color', '#000');
        bgColor = $getSelectionStyleValueForProperty(selection, 'background-color', '#fff');
        fontFamily = $getSelectionStyleValueForProperty(selection, 'font-family', 'Arial');
      } catch{
        console.log('[ERROR] - $getSelectionStyleValueForProperty');
      }

      _formats = {
        ...internalFormat,
        fontSize,
        fontColor,
        bgColor,
        fontFamily,
      };
    }
    return _formats;
  }, [editor, internalFormat]);

  useEffect(() => {
    editor.registerCommand<boolean>(
      SELECTION_CHANGE_COMMAND,
      () => {
        const _formats = getEditorFormats();
        setFormats(_formats);
        setInternalFormat(_formats);
        return false;
      },
      COMMAND_PRIORITY_CRITICAL
    );

    editor.registerCommand(
      KEY_DOWN_COMMAND,
      (payload) => {
      const event: KeyboardEvent = payload;
      const {code, ctrlKey, metaKey} = event;
      if (code === 'KeyK' && (ctrlKey || metaKey)) {
        event.preventDefault();
        editor.dispatchCommand(
          TOGGLE_LINK_COMMAND,
          sanitizeUrl('https://'),
        );
      }
      return false;
    },
    COMMAND_PRIORITY_NORMAL,
  );

  editor.registerCommand<boolean>(
    CAN_UNDO_COMMAND,
    (payload) => {
      setCanUndo(payload);
      return false;
    },
    COMMAND_PRIORITY_CRITICAL
  );

  editor.registerCommand<boolean>(
    CAN_REDO_COMMAND,
    (payload) => {
      setCanRedo(payload);
      return false;
    },
    COMMAND_PRIORITY_CRITICAL
  );

  editor.registerUpdateListener(({ editorState }) => {
    editorState.read(() => {
      const _formats = getEditorFormats();
      setFormats(_formats);
      setInternalFormat(_formats);
    });
  });
  }, [editor, internalFormat, getEditorFormats, setFormats, setInternalFormat]);

  return null;
}

export default SetFormatPlugin;
