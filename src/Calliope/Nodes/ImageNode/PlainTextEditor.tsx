import { useEffect } from 'react';
import type { LexicalEditor } from 'lexical';
import { createEditor } from 'lexical';
import { LexicalNestedComposer } from '@lexical/react/LexicalNestedComposer';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin';
import Placeholder from './Placeholder';

const DEFAULT_CAPTION_ENTER = 'Enter a caption';

type ImageConfigProps = {
  addCaptionText: string;
  defaultCaptionText: string;
};

type PlainTextEditorProps = {
   imageConfig: ImageConfigProps;
   caption: LexicalEditor | string;
   readOnly: boolean;
}

const PlainTextEditor = ({ imageConfig, caption, readOnly }: PlainTextEditorProps) => {
  useEffect(() => {
    if((typeof caption !== 'string') && caption.setEditable){
      caption.setEditable(!readOnly);
    }
  }, [readOnly, caption]);

  const CAPTION_ENTER_TEXT = imageConfig.defaultCaptionText ?? DEFAULT_CAPTION_ENTER;
  const initialEdior: LexicalEditor = (typeof caption !== 'string') ? caption : createEditor();

  return (
    <LexicalNestedComposer
      initialEditor={initialEdior}
    >
      <PlainTextPlugin
        ErrorBoundary={LexicalErrorBoundary}
        contentEditable={<ContentEditable className="ImageNode__contentEditable" />}
        placeholder={
        <Placeholder
          className="ImageNode__placeholder"
        >
          {CAPTION_ENTER_TEXT}
        </Placeholder>
        }
      />
    </LexicalNestedComposer>
  );
};

export default PlainTextEditor;
