import {
  useRef,
  useState,
  useEffect,
  useCallback,
  useImperativeHandle
} from 'react';
import { CAN_USE_DOM } from './shared/canUseDOM';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { CLEAR_EDITOR_COMMAND } from 'lexical';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import EditorNodes from './Nodes/Nodes';
import EditorPlugins from './Plugins/Plugins';
import EDITOR_COMMANDS from './Plugins/Commands';
import {
  CalliopeEditorProps,
  CalliopeFormatTypes,
  EditorRefType,
  EditorCommand,
} from './CalliopeEditorTypes';
import { CalliopeContext } from './context';
import theme from './editorTheme';
import './CalliopeEditor.css';

const INITIAL_FORMATS: CalliopeFormatTypes = {
  blockType: 'paragraph',
  selectedElementKey: null,
  isLink: false,
  isBold: false,
  isItalic: false,
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
  codeLanguage: '',
  fontSize: '15px',
  fontColor: '#000',
  bgColor: '#fff',
  fontFamily: 'Arial',
};

const Editor = ({ config, containerRef, setFormats }: CalliopeEditorProps) => {
  const [internalFormat, setInternalFormat] =
    useState<CalliopeFormatTypes>(INITIAL_FORMATS);
  const [isSmallWidthViewport, setIsSmallWidthViewport] = useState<boolean>(false);
  const [floatingAnchorElem, setFloatingAnchorElem] = useState<HTMLDivElement | null>(
    null
  );

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

  const initialConfig = {
    namespace: 'Calliope',
    nodes: EditorNodes,
    onError: config.onError,
    editable: !config.readOnly,
    editorState: config.initialState,
    theme,
  };

  const [editorRef, setEditorRef] = useState<EditorRefType | null>(null);
  const editorStateRef = useRef();

  const clear = () => {
    if (editorRef) {
      editorRef.dispatchCommand(CLEAR_EDITOR_COMMAND);
      editorRef.focus();
    }
  };

  const focus = () => {
    if (!editorRef) return;
    return editorRef.focus();
  };

  const getContent = () => {
    if (!editorRef) return;
    return editorStateRef.current;
  };

  const executeCommand = (name: string, props: any) => {
    if (!editorRef) return;

    const selectedCommand = EDITOR_COMMANDS.find((c: EditorCommand) => c.name === name);

    if (selectedCommand === undefined) return;

    const COMMAND_TO_DISPATCH = selectedCommand.command;

    if (selectedCommand.directCommand) {
      editorRef.dispatchCommand(COMMAND_TO_DISPATCH, props);
    } else {
      COMMAND_TO_DISPATCH(editorRef, internalFormat, props);
    }
  };

  const onEditorChange = useCallback(
    (editorState: any) => {
      editorStateRef.current = editorState;
    },
    [editorStateRef]
  );

  const pluginConfig = {
    ...config,
    nodes: EditorNodes,
    plugins: EditorPlugins,
    onEditorChange: onEditorChange,
  };

  useImperativeHandle(containerRef, () => {
    return {
      focus: focus,
      clear: clear,
      getContent: getContent,
      executeCommand: executeCommand,
    };
  });

  return (
    <CalliopeContext.Provider value={pluginConfig}>
      <div className="editor-shell">
        <div
          className={config.readOnly ? 'editor-container-readonly' : 'editor-container'}
          ref={containerRef}
        >
          <LexicalComposer initialConfig={initialConfig}>
            <RichTextPlugin
              contentEditable={
                <div className="editor-scroller">
                  <div className="editor" ref={onRef}>
                    <ContentEditable
                      className={`editor-content-editable-root editor-${
                        config.readOnly ? 'readonly' : 'editable'
                      }`}
                    />
                  </div>
                </div>
              }
              placeholder={
                <div className="editor-placeholder">{config.placeholderText}</div>
              }
              initialEditorState={config.initialState}
              ErrorBoundary={LexicalErrorBoundary}
            />
            <EditorPlugins
              readOnly={config.readOnly}
              setFormats={setFormats}
              isSmallWidthViewport={isSmallWidthViewport}
              internalFormat={internalFormat}
              setInternalFormat={setInternalFormat}
              setEditorRef={setEditorRef}
              editorRef={editorRef}
              onEditorChange={onEditorChange}
              floatingAnchorElem={floatingAnchorElem}
              config={config}
            />
          </LexicalComposer>
        </div>
      </div>
    </CalliopeContext.Provider>
  );
};

export default Editor;
