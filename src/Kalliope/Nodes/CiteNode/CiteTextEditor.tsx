import {useContext, useEffect} from 'react';
import type { LexicalEditor } from 'lexical';
import { LexicalNestedComposer } from '@lexical/react/LexicalNestedComposer';
import KalliopeEditorTheme from '../../editorTheme';
import { CalliopeContext } from '../../context';
import Plugins from "../../Plugins/Plugins";
import {RichTextPlugin} from "@lexical/react/LexicalRichTextPlugin";
import {ContentEditable} from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
type CiteEditorProps = {
  citeEditor: LexicalEditor;
  readOnly: boolean;
}

const CiteTextEditor = ({ citeEditor, readOnly }:CiteEditorProps) => {
  useEffect(() => {
    citeEditor.setEditable(!readOnly);
  }, [readOnly, citeEditor]);


  const calliopeConfig = useContext(CalliopeContext);
  const {
    setFormats,
    isSmallWidthViewport,
    internalFormat,
    setInternalFormat,
    onEditorChange,
    config
  } = calliopeConfig;

  return (
    <LexicalNestedComposer
        initialEditor={citeEditor}
        initialTheme={KalliopeEditorTheme}
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
         setEditorRef={() =>{}}
         onEditorChange={onEditorChange}
         floatingAnchorElem={null}
         editorRef={null}
         config={config}
     />
    </LexicalNestedComposer>
  );
};

export default CiteTextEditor;
