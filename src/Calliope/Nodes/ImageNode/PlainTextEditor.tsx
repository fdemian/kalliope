import React, { useEffect } from 'react';
import { LexicalNestedComposer } from '@lexical/react/LexicalNestedComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin';
import Placeholder from './Placeholder';

const DEFAULT_CAPTION_ENTER = 'Enter a caption';

const PlainTextEditor = ({ imageConfig, caption, readOnly }) => {
  useEffect(() => {
    caption.setEditable(!readOnly);
  }, [readOnly, caption]);

  const CAPTION_ENTER_TEXT = imageConfig.defaultCaptionText ?? DEFAULT_CAPTION_ENTER;

  return (
    <LexicalNestedComposer initialEditor={caption}>
      <PlainTextPlugin
        contentEditable={<ContentEditable className="ImageNode__contentEditable" />}
        placeholder={
          <Placeholder className="ImageNode__placeholder">
            {CAPTION_ENTER_TEXT}
          </Placeholder>
        }
      />
    </LexicalNestedComposer>
  );
};

export default PlainTextEditor;
