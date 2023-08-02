import { useContext } from 'react';
import type { LexicalEditor, SerializedEditorState } from 'lexical';
import { LexicalNestedComposer } from '@lexical/react/LexicalNestedComposer';
import KalliopeEditorTheme from '../../editorTheme';
import { CalliopeContext, CalliopeContextType } from '../../context';
import Plugins from "../../Plugins/Plugins";
import Nodes from "../Nodes";
import {RichTextPlugin} from "@lexical/react/LexicalRichTextPlugin";
import {ContentEditable} from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import {createEditor} from "lexical";

type CiteEditorProps = {
  content: string | SerializedEditorState;
  readOnly: boolean;
}

const CiteTextEditor = ({ content, readOnly }:CiteEditorProps) => {

  const calliopeConfig: CalliopeContextType | null = useContext(CalliopeContext);

  if(!calliopeConfig)
    return null;

  const {
    setFormats,
    isSmallWidthViewport,
    internalFormat,
    setInternalFormat,
    onEditorChange,
    config
  } = calliopeConfig;

  const initialEditor: LexicalEditor = createEditor();

  if (content !== null && (typeof content) === 'string') {
    const editorState = initialEditor.parseEditorState(content);
    if (!editorState.isEmpty()) {
      initialEditor.setEditorState(editorState);
    }
  }

return (
<LexicalNestedComposer
    initialEditor={initialEditor}
    initialNodes={Nodes}
    initialTheme={KalliopeEditorTheme}
    skipCollabChecks={true}
>
  <RichTextPlugin
    placeholder={<div className="editor-placeholder"></div>}
    contentEditable={<ContentEditable className="CiteNode__contentEditable" />}
    ErrorBoundary={LexicalErrorBoundary}
  />
  <Plugins
     readOnly={readOnly}
     setFormats={setFormats}
     isSmallWidthViewport={isSmallWidthViewport}
     internalFormat={internalFormat}
     setInternalFormat={setInternalFormat}
     editorRef={null}
     isNestedPlugin={true}
     onEditorChange={onEditorChange}
     floatingAnchorElem={null}
     config={config}
  />
</LexicalNestedComposer>
);
};

export default CiteTextEditor;
