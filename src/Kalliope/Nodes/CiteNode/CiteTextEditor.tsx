import {useContext, useEffect, useState} from 'react';
import type {EditorState, LexicalEditor, SerializedEditorState} from 'lexical';
import { LexicalNestedComposer } from '@lexical/react/LexicalNestedComposer';
import KalliopeEditorTheme from '../../editorTheme';
import { CalliopeContext, CalliopeContextType } from '../../context';
import Plugins from "../../Plugins/Plugins";
import Nodes from "../Nodes";
import {RichTextPlugin} from "@lexical/react/LexicalRichTextPlugin";
import ContentEditable from "../UIPath/ContentEditable";
import {LexicalErrorBoundary} from '@lexical/react/LexicalErrorBoundary';
import Placeholder from '../ImageNode/Placeholder';
import { initial } from 'lodash-es';

type CiteEditorProps = {
  initialEditor: LexicalEditor;
  content: string | SerializedEditorState;
  readOnly: boolean;
}

const CiteTextEditor = ({ initialEditor, content, readOnly }:CiteEditorProps) => {

  const [citeEditorState, setCiteEditorState] = useState<EditorState|null> (null);
  const calliopeConfig: CalliopeContextType | null = useContext(CalliopeContext);

  useEffect(() => {
    if (content !== null && (typeof content) === 'string') {
      const editorState = initialEditor.parseEditorState(content);
      if (!editorState.isEmpty()) {
        setCiteEditorState(editorState);
        initialEditor.setEditorState(editorState);
      }
    }
  }, [content, initialEditor])

  useEffect(() => {

    const newState = JSON.stringify(initialEditor.getEditorState());
    const currState = JSON.stringify(citeEditorState);
    const stateChanged = newState !== currState;
    
    if (stateChanged && citeEditorState && !citeEditorState.isEmpty()) {
      initialEditor.setEditorState(citeEditorState);
    }
  }, [initialEditor, citeEditorState])


  if(!calliopeConfig)
    return null;

  const setEditorContent = (newContent:EditorState): void => {
    setCiteEditorState(newContent);
  }

  const {
    setFormats,
    setCanUndo,
    setCanRedo,
    isSmallWidthViewport,
    internalFormat,
    setInternalFormat,
    config
  } = calliopeConfig;


  return (
  <LexicalNestedComposer
      initialEditor={initialEditor}
      initialNodes={Nodes}
      initialTheme={KalliopeEditorTheme}
      skipCollabChecks={true}
  >
    <RichTextPlugin
      placeholder={<Placeholder className="CiteEditor__placeholder"> </Placeholder>}
      contentEditable={<ContentEditable placeholder="" className="CiteNode__contentEditable" />}
      ErrorBoundary={LexicalErrorBoundary}
    />
    <Plugins
       readOnly={readOnly}
       setFormats={setFormats}
       setCanUndo={setCanUndo}
       setCanRedo={setCanRedo}
       isSmallWidthViewport={isSmallWidthViewport}
       internalFormat={internalFormat}
       setInternalFormat={setInternalFormat}
       editorRef={null}
       isNestedPlugin={true}
       onEditorChange={setEditorContent}
       floatingAnchorElem={null}
       config={config}
    />
  </LexicalNestedComposer>
  );
}

export default CiteTextEditor;
