import React from 'react';
import CalliopeEditor from './CalliopeEditor';
import 'jest-canvas-mock';

const TestComponentMock = (props) => {

  const {
    initialState,
    onSearchChange,
    onAddMention,
    onRemoveMention,
    setFormats,
    mentionsData,
    containerRef
  } = props;

  const config = {
    placeholderText: 'PLACEHOLDER_TEXT',
    initialState: initialState,
    readOnly: false,
    autoFocus: false,
    onError: (error) => {
      throw error;
    },
    plugins:[],
    imageConfig: {
      addCaptionText: "ADD_CAPTION",
      defaultCaptionText: "ENTER_IMAGE_CAPTION"
    },
    twitterConfig: {
      loadingComponent: ({ tweetId }) => (<p>LOADING_TWEET</p>)
    },
    collapsibleConfig: {
      open: true
    },
    dragAndDropImage: {
      handleDroppedFile: (file) => {
        console.log(":::::>");
        console.log(file);
        console.log(":::::>");
      }
    },
    citation: {
      sourceLinkComponent: ({ sourceLink }) => (
      <>
        <a href={sourceLink}>[source]</a>
      </>
      ),
    },
    emojiConfig: {
      locale: 'es'
    },
    mentions: {
      onSearchChange: onSearchChange,
      onAddMention: onAddMention,
      onRemoveMention: onRemoveMention,
      entryComponent: ({option: {avatar, name, link}}) => (
       <>
         <p>{avatar}</p>
         <p>{name}</p>
         <p>{link}</p>
       </>
      ),
      mentionsData: mentionsData
    }
  }

  return (
  <CalliopeEditor
     config={config}
     containerRef={containerRef}
     setFormats={setFormats}
  />
  );
}

export default TestComponentMock;
