import React, { useRef, useState } from 'react';
import Editor from '../Calliope/CalliopeEditor';
import {initialMentions} from './mentionsData';
import emojiData from 'emojibase-data/en/data.json';

type EntryEditorProps = {
  readOnly: boolean,
  initialState: string,
  setFormats: (formats:any) => void
};

type EntryComponentProps = {
  avatar:string,
  name:string,
  link:string
};

type MentionComponentProps = {
  avatar:string,
  name:string,
  link:string | null
};

export const EntryEditor: React.VFC<EntryEditorProps> = ({ readOnly, initialState, setFormats }: EntryEditorProps) => {

  const containerRef = useRef(null);
  const [suggestions, setSuggestions] = useState(initialMentions);

  const onSearchChange = (match:any) => {
    if(match && match.matchingString) {
      const stringMatch = match.matchingString;
      const newSuggestions = initialMentions.filter(p => p.name.includes(stringMatch));
      setSuggestions(newSuggestions);
    }
  }

  const config = {
    placeholderText: 'Ingrese texto...',
    initialState: initialState,
    readOnly: readOnly,
    autoFocus: false,
    onError: (error:any) => {
      throw error;
    },
    plugins:[],
    imageConfig: {
      addCaptionText: "Add caption",
      defaultCaptionText: "Enter image caption..."
    },
    emojiConfig: {
      emojiData: emojiData
    },
    dragAndDropImage: {
      handleDroppedFile: (file:any) => {}
    },
    twitterConfig: {
      loadingComponent: ({tweetId}: {tweetId: string}) => (
      <p>
        Loading tweet...
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
      )
    },
    mentions: {
      onSearchChange: onSearchChange,
      onAddMention: (mention:MentionComponentProps) => {
        console.clear();
        console.log(mention);
      },
      entryComponent: ({avatar, name, link}:EntryComponentProps) => (
       <>
        &nbsp; <strong>{name}</strong>
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
