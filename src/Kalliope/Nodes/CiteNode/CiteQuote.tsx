import { useContext } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { CalliopeContext } from '../../context';
import CiteTextEditor from './CiteTextEditor';
import './CiteQuote.css';
import {LexicalEditor, SerializedEditorState} from "lexical";

type SourceCompProps = {
  sourceLink: string
};

type AuthorCompProps = {
  author: {
    link: string;
    name: string;
  }
};

type CiteQuoteProps = {
  authorName: string;
  authorLink: string;
  sourceLink: string;
  content: string | SerializedEditorState;
  initialEditor: LexicalEditor;
};

const DefaultSourceComp = ({ sourceLink }: SourceCompProps) => <a href={sourceLink}>{sourceLink}</a>;
const DefaultAuthorComp = ({ author }: AuthorCompProps) => {
  return <a href={author.link}>{author.name}</a>;
};

const CiteQuote = ({ authorName, authorLink, sourceLink, content, initialEditor }: CiteQuoteProps) => {
  const calliopeConfig = useContext(CalliopeContext);
  const [editor] = useLexicalComposerContext();

  let SourceLinkComp = DefaultSourceComp;
  let AuthorComponent = DefaultAuthorComp;

  if(calliopeConfig !== null && calliopeConfig.config){
    if(calliopeConfig.config.citation !== null){
      const { citation } = calliopeConfig.config;
      const { sourceLinkComponent, authorComponent } = citation;
      SourceLinkComp = (sourceLinkComponent !== null && sourceLinkComponent !== undefined) ? sourceLinkComponent : DefaultSourceComp;
      AuthorComponent =  (authorComponent !== null && authorComponent !== undefined) ? authorComponent : DefaultAuthorComp;
    }
  }

  const author = {
    name: authorName,
    link: authorLink,
  };

  return (
      <figure>
        <figcaption>
          <AuthorComponent author={author} />
          <cite>
            &nbsp;
            <SourceLinkComp sourceLink={sourceLink} />
          </cite>
        </figcaption>
        <blockquote>
          <CiteTextEditor
              initialEditor={initialEditor}
              content={content}
              readOnly={!editor.isEditable()}
          />
        </blockquote>
      </figure>
  );
};

export default CiteQuote;
