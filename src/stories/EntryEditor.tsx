import React, { useRef, useState } from 'react';
import Editor from '../Kalliope/KalliopeEditor';
import {initialMentions} from './mentionsData';
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

type MatchType = {
  matchingString: string;
}

export const EntryEditor: React.VFC<EntryEditorProps> = ({ readOnly, initialState, setFormats }: EntryEditorProps) => {

  const containerRef = useRef(null);
  const [suggestions, setSuggestions] = useState(initialMentions);

  const onSearchChange = (match:MatchType) => {
    if(match && match.matchingString) {
      const stringMatch = match.matchingString;
      const newSuggestions = initialMentions.filter(p => p.name.includes(stringMatch));
      setSuggestions(newSuggestions);
    }
  }

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
      onSearchChange,
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
      mentionsData: suggestions
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
