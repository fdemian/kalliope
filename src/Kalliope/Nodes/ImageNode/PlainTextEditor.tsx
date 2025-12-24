import { useEffect } from 'react';
import {BLUR_COMMAND, COMMAND_PRIORITY_EDITOR, LexicalEditor} from 'lexical';
import { createEditor } from 'lexical';
import { LexicalNestedComposer } from '@lexical/react/LexicalNestedComposer';
import {LexicalErrorBoundary} from '@lexical/react/LexicalErrorBoundary';
import ContentEditable from '../UIPath/ContentEditable';
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin';
import Placeholder from './Placeholder';
import { CalliopeConfigProps } from '../../KalliopeEditorTypes';
import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {$isCaptionEditorEmpty} from "./ImageNode";
const DEFAULT_CAPTION_ENTER = 'Enter a caption';

type PlainTextEditorProps = {
  config: CalliopeConfigProps;
  caption: LexicalEditor | string;
  readOnly: boolean;
  setShowCaption: (showCaption: boolean) => void;
}

function DisableCaptionOnBlur({ setShowCaption }: {
  setShowCaption: (show: boolean) => void;
}) {
  const [editor] = useLexicalComposerContext();
  useEffect(() =>
    editor.registerCommand(
      BLUR_COMMAND,
      () => {
        if ($isCaptionEditorEmpty()) {
          setShowCaption(false);
        }
        return false;
      },
      COMMAND_PRIORITY_EDITOR,
    ),
  );
  return null;
}

const PlainTextEditor = ({ config, caption, readOnly, setShowCaption }: PlainTextEditorProps) => {
  useEffect(() => {
    if((typeof caption !== 'string') && caption.setEditable){
      caption.setEditable(!readOnly);
    }
  }, [readOnly, caption]);

  let CAPTION_ENTER_TEXT = DEFAULT_CAPTION_ENTER;

  if(config !== null && config.imageConfig) {
    CAPTION_ENTER_TEXT = config.imageConfig.defaultCaptionText;
  }
  const initialEdior: LexicalEditor = (typeof caption !== 'string') ? caption : createEditor({namespace: 'kalliope/ImageNodeCaption'});

  return (
    <LexicalNestedComposer
      initialEditor={initialEdior}
    >
      <DisableCaptionOnBlur setShowCaption={setShowCaption} />
      <PlainTextPlugin
        ErrorBoundary={LexicalErrorBoundary}
        contentEditable={<ContentEditable placeholder={config.placeholderText} className="ImageNode__contentEditable" />}
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
