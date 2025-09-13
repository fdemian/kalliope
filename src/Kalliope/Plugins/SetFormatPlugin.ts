import { useEffect, useCallback } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
  $isNodeSelection,
  $isElementNode,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_NORMAL,
  SELECTION_CHANGE_COMMAND,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  KEY_DOWN_COMMAND,
  LexicalNode,
  $isRootOrShadowRoot
} from 'lexical';
import type { TextNode, ElementNode, RangeSelection } from 'lexical';
import { CalliopeFormatTypes } from '../KalliopeEditorTypes';
import {sanitizeUrl} from '../utils/url';
import { $getNearestNodeOfType, $findMatchingParent } from '@lexical/utils';
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

export const blockTypeToBlockName = {
  bullet: 'Bulleted List',
  check: 'Check List',
  code: 'Code Block',
  h1: 'Heading 1',
  h2: 'Heading 2',
  h3: 'Heading 3',
  h4: 'Heading 4',
  h5: 'Heading 5',
  h6: 'Heading 6',
  number: 'Numbered List',
  paragraph: 'Normal',
  quote: 'Quote',
};


function $findTopLevelElement(node: LexicalNode) {
  let topLevelElement =
    node.getKey() === 'root'
      ? node
      : $findMatchingParent(node, (e) => {
          const parent = e.getParent();
          return parent !== null && $isRootOrShadowRoot(parent);
        });

  if (topLevelElement === null) {
    topLevelElement = node.getTopLevelElementOrThrow();
  }
  return topLevelElement;
}


const $handleHeadingNode = (selectedElement: LexicalNode):string | number  => {
    const type = $isHeadingNode(selectedElement)
      ? selectedElement.getTag()
      : selectedElement.getType();

    if (type in blockTypeToBlockName) {
      const blockType = type as keyof typeof blockTypeToBlockName;  
      return blockType;
    }

    return '';
  };

const $handleCodeNode = (element: LexicalNode): string => {
    if ($isCodeNode(element)) {
      const language =
        element.getLanguage() as keyof typeof CODE_LANGUAGE_MAP;
        return language ? CODE_LANGUAGE_MAP[language] || language : '';
    }

    return '';
};


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
      const element = $findTopLevelElement(anchorNode);
      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);

      if (elementDOM !== null) {
        selectedElementKey = elementKey;

        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType(anchorNode, ListNode);
          const type = parentList ? parentList.getListType() : element.getListType();
          blockType = type;
        } else {
          blockType = $handleHeadingNode(element);
          codeLanguage = $handleCodeNode(element);
        }
      }

      // Update links
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        isLink = true;
      }

      const elementFormatTypeFromFn = $isElementNode(element) ? element.getFormatType() : '';
      const elementFormatTypeStr = elementFormatTypeFromFn.trim() !== '' ? elementFormatTypeFromFn : internalFormat.elementFormatType;
      
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
        elementFormatType: elementFormatTypeStr.trim() !== '' ? elementFormatTypeStr : 'left',
        listStartNumber: null,
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

    if ($isNodeSelection(selection)) {
      const nodes = selection.getNodes();
      for (const selectedNode of nodes) {
        const parentList = $getNearestNodeOfType<ListNode>(
          selectedNode,
          ListNode,
        );
        if (parentList) {
          blockType =parentList.getListType();
          
        } else {
          const selectedElement = $findTopLevelElement(selectedNode);
          blockType = $handleHeadingNode(selectedElement);
          codeLanguage = $handleCodeNode(selectedElement);
        }
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

  editor.registerUpdateListener(({editorState}) => {
    editorState.read(
      () => {
        const _formats = getEditorFormats();
        setFormats(_formats);
        setInternalFormat(_formats);
      },
      {editor: editor},
    );
  });

  }, [editor, internalFormat, getEditorFormats, setFormats, setInternalFormat]);

  return null;
}

export default SetFormatPlugin;
