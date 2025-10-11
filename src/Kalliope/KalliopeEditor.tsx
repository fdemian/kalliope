// @ts-nocheck
import {ReactElement, useMemo} from 'react';
import {
  useRef,
  useState,
  useEffect,
  useCallback,
  useImperativeHandle
} from 'react';
import { CAN_USE_DOM } from './shared/canUseDOM';
import {LexicalErrorBoundary} from '@lexical/react/LexicalErrorBoundary';
import {CLEAR_EDITOR_COMMAND, EditorState, defineExtension } from 'lexical';
import {LexicalExtensionComposer} from '@lexical/react/LexicalExtensionComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import ContentEditable from "./Nodes/UIPath/ContentEditable";

import EditorNodes from './Nodes/Nodes';
import EditorPlugins from './Plugins/Plugins';
import EDITOR_COMMANDS from './Plugins/Commands';
import type {
  CalliopeEditorProps,
  CalliopeFormatTypes,
  EditorCommand
} from './KalliopeEditorTypes';
import { buildHTMLConfig } from './buildHTMLConfig';
import { CalliopeContext } from './context';
import theme from './editorTheme';
import './KalliopeEditor.css';

const INITIAL_FORMATS: CalliopeFormatTypes = {
  blockType: 'paragraph',
  selectedElementKey: null,
  isLink: false,
  isBold: false,
  isItalic: false,
  isLowercase: false,
  isUppercase: false,
  isCapitalize: false,
  isUnderline: false,
  isStrikethrough: false,
  isSubscript: false,
  isSuperscript: false,
  isSpoiler: false,
  isKeyboard: false,
  isCode: false,
  canUndo: false,
  canRedo: false,
  isRTL: false,
  listStartNumber: null as number | null,
  codeLanguage: '',
  fontSize: '15px',
  fontColor: '#000',
  bgColor: '#fff',
  elementFormatType: 'left',
  fontFamily: 'Arial',
};

const Editor = ({ config, containerRef, setFormats, setCanUndo, setCanRedo }: CalliopeEditorProps): ReactElement => {
  const [internalFormat, setInternalFormat] =
    useState<CalliopeFormatTypes>(INITIAL_FORMATS);
  const [isSmallWidthViewport, setIsSmallWidthViewport] = useState<boolean>(false);
  const [floatingAnchorElem, setFloatingAnchorElem] = useState<HTMLDivElement | null>(
    null
  );

  const editorRef = useRef(null);
  const editorStateRef = useRef(null);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  useEffect(() => {
    const updateViewPortWidth = () => {
      const isNextSmallWidthViewport =
        CAN_USE_DOM && window.matchMedia('(max-width: 1025px)').matches;

      if (isNextSmallWidthViewport !== isSmallWidthViewport) {
        setIsSmallWidthViewport(isNextSmallWidthViewport);
      }
    };

    updateViewPortWidth();
    window.addEventListener('resize', updateViewPortWidth);

    return () => {
      window.removeEventListener('resize', updateViewPortWidth);
    };
  }, [isSmallWidthViewport]);

  if(editorRef && editorRef.current) {
    const isEditable = !config.readOnly;
    if(editorRef.current.isEditable() !== isEditable){
      editorRef.current.setEditable(!config.readOnly);
    }
  }

  const clear = () => {
    if (editorRef && editorRef.current) {
      editorRef.current.dispatchCommand(CLEAR_EDITOR_COMMAND);
      editorRef.current.focus();
    }
  };

  const focus = () => {
    if (!editorRef || editorRef.current) return;
    editorRef.current.focus();
  };

  const getContent = () => {
    if (!editorStateRef || !editorStateRef.current) return null;
    return editorStateRef.current;
  };

  const executeCommand = (name: string, props: any) => {
    if (!editorRef || !editorRef.current) return;

    const selectedCommand = EDITOR_COMMANDS.find((c: EditorCommand) => c.name === name);

    if (selectedCommand === undefined) return;

    const COMMAND_TO_DISPATCH = selectedCommand.command;

    if (selectedCommand.directCommand) {
      editorRef.current.dispatchCommand(COMMAND_TO_DISPATCH, props);
    } else {
      COMMAND_TO_DISPATCH(editorRef, internalFormat, props);
    }
  };

  const onEditorChange = useCallback(
    (editorState: EditorState) => {
      editorStateRef.current = editorState;
    },
    [editorStateRef]
  );

  const pluginConfig = {
    config,
    nodes: EditorNodes,
    plugins: EditorPlugins,
    onEditorChange,
    setFormats,
    setCanUndo,
    setCanRedo,
    isSmallWidthViewport,
    internalFormat,
    setInternalFormat,
    editorRef,
    floatingAnchorElem
  };

  useImperativeHandle(containerRef, () => {
    return {
      focus,
      clear,
      getContent,
      executeCommand,
    };
  });

  const app = useMemo(
    () =>
      defineExtension({
        $initialEditorState: config.initialState,
        html: buildHTMLConfig(),
        name: 'Kalliope',
        namespace: 'Kalliope',
        nodes: EditorNodes,
        theme: theme,
        onError: config.onError,
        editable: !config.readOnly
      }),
    [],
  );

  return (
  <CalliopeContext.Provider value={pluginConfig}>
    <div className="editor-shell">
      <div
        className={config.readOnly ? 'editor-container-readonly' : 'editor-container'}
      >
        <LexicalExtensionComposer extension={app} contentEditable={null}>
          <RichTextPlugin
            contentEditable={
              <div className="editor-scroller">
                <div className="editor" ref={onRef}>
                  <ContentEditable
                    className={`editor-content-editable-root editor-${
                      config.readOnly ? 'readonly' : 'editable'
                    }`}
                    placeholderClassName='editor-placeholder'
                    aria-placeholder={config.placeholderText}
                    placeholder={config.placeholderText}
                  />
                </div>
              </div>
             }
             ErrorBoundary={LexicalErrorBoundary}
          />
          <EditorPlugins
             readOnly={config.readOnly}
             setFormats={setFormats}
             setCanUndo={setCanUndo}
             setCanRedo={setCanRedo}
             isSmallWidthViewport={isSmallWidthViewport}
             internalFormat={internalFormat}
             setInternalFormat={setInternalFormat}
             editorRef={editorRef}
             isNestedPlugin={false}
             onEditorChange={onEditorChange}
             floatingAnchorElem={floatingAnchorElem}
             config={config}
            />
          </LexicalExtensionComposer>
        </div>
      </div>
    </CalliopeContext.Provider>
  );
};

export default Editor;
