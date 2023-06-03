import { useEffect } from 'react';
import type { LexicalEditor } from 'lexical';
import { LexicalNestedComposer } from '@lexical/react/LexicalNestedComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';

type CiteEditorProps = {
  config: any;
  citeEditor: LexicalEditor;
  readOnly: boolean;
}

const CiteTextEditor = ({ config, citeEditor, readOnly }:CiteEditorProps) => {
  useEffect(() => {
    citeEditor.setEditable(!readOnly);
  }, [readOnly, citeEditor]);

  return (
    <LexicalNestedComposer initialEditor={citeEditor}>
      <RichTextPlugin
        placeholder={<div className="editor-placeholder"></div>}
        contentEditable={<ContentEditable className="CiteNode__contentEditable" />}
        ErrorBoundary={LexicalErrorBoundary}
      />
    </LexicalNestedComposer>
  );
};

export default CiteTextEditor;
