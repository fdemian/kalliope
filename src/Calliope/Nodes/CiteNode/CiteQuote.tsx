import React, { useContext } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { CalliopeContext } from '../../context';
import CiteTextEditor from './CiteTextEditor';
import './CiteQuote.css';

const DefaultSourceComp = ({ sourceLink }) => <a href={sourceLink}>{sourceLink}</a>;
const DefaultAuthorComp = ({ author }) => {
  return <a href={author.link}>{author.name}</a>;
};

const CiteQuote = ({ authorName, authorLink, sourceContent, sourceLink, citeEditor }) => {
  const calliopeConfig = useContext(CalliopeContext);
  const { citation } = calliopeConfig;
  const [editor] = useLexicalComposerContext();
  const { sourceLinkComponent, authorComponent } = citation;
  const SourceComp = sourceLinkComponent;
  const AuthorComp = authorComponent;
  const SourceLinkComp = SourceComp ? SourceComp : DefaultSourceComp;
  const AuthorComponent = AuthorComp ? AuthorComp : DefaultAuthorComp;

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
          config={calliopeConfig}
          citeEditor={citeEditor}
          content={sourceContent}
          readOnly={!editor.isEditable()}
        />
      </blockquote>
    </figure>
  );
};

export default CiteQuote;
