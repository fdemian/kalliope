import React, { useRef } from 'react';
import Editor from '../Kalliope/KalliopeEditor';
import emojiData from 'emojibase-data/en/data.json';
import type { MentionItem } from '../Kalliope/KalliopeEditorTypes';
import {CalliopeFormatTypes, ShowModalProps} from "../Kalliope/KalliopeEditorTypes";

type EntryEditorProps = {
  readOnly: boolean,
  initialState: string,
  setFormats: (formats: CalliopeFormatTypes) => void
};

type AvatarEntryComponent = {
  option: MentionItem;
}

type AuthorCompProps = {
  author: {
    link: string;
    name: string;
  }
};

export const EntryEditor: React.VFC<EntryEditorProps> = ({ readOnly, initialState, setFormats }: EntryEditorProps) => {

  const containerRef = useRef(null);
  const config = {
    placeholderText: 'Ingrese texto...',
    initialState,
    readOnly,
    autoFocus: false,
    onError: (error: Error) => {
      throw error;
    },
    plugins:[],
    imageConfig: {
      addCaptionText: "Add caption",
      defaultCaptionText: "Enter image caption..."
    },
    inlineImage: {
      showModal: (showModalProps: ShowModalProps) => console.log(showModalProps)
    },
    excalidrawConfig: {
      modal: null
    },
    emojiConfig: {
      emojiData
    },
    dragAndDropImage: {
      handleDroppedFile: (file:File) => console.log(file)
    },
    twitterConfig: {
      loadingComponent: ( {tweetId} : {tweetId: string}) => (
      <p>
        Loading tweet...{tweetId}
      </p>
      )
    },
    collapsibleConfig: {
      open: false
    },
    citation: {
      sourceLinkComponent: ({ sourceLink }:{ sourceLink: string}) => (
      <>
        <a href={sourceLink}>[source]</a>
      </>
      ),
      authorComponent: ({ author }: AuthorCompProps) => (
        <a href={author.link}>{author.name}</a>
      )
    },
    mentions: {
      onSearchChange: null,
      onAddMention: (mention:MentionItem) => {
        console.clear();
        console.log(mention);
      },
      entryComponent: ({option: { name }}: AvatarEntryComponent) => (
       <>
        <img
          src="https://testing-library.com/img/octopus-64x64.png"
          width="20"
          height="20"
          alt="User avatar placeholder"
          />
          &nbsp; &nbsp; <strong>{name}</strong>
       </>
      ),
      mentionsData: []
    }
  };

  return (
  <div className="App">
    <br />
    <br />
    <h2>EDITOR READ ONLY</h2>
    <div style={{border: '1px solid black'}}>
      <Editor
        containerRef={containerRef}
        setFormats={setFormats}
        config={config}
      />
    </div>
 </div>
 );
}
