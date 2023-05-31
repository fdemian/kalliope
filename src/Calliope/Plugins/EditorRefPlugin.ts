import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
// import PropTypes from 'prop-types';

const EditorRefPlugin = ({ setEditorRef }) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // Focus the editor when the effect fires!
    setEditorRef(editor);
  }, [editor, setEditorRef]);

  return null;
};

/*
EditorRefPlugin.propTypes = {
  setEditorRef: PropTypes.func
};*/

export default EditorRefPlugin;
