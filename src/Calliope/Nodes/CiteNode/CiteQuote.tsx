import { useContext } from 'react';
import type { LexicalEditor } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { CalliopeContext } from '../../context';
import CiteTextEditor from './CiteTextEditor';
import './CiteQuote.css';

type SourceCompProps = {
  sourceLink: string
};

type AuthorCompProps = {
  author: string
};

type CiteQuoteProps = {
  authorName: string;
  authorLink: string;
  sourceContent: string | LexicalEditor;
  sourceLink: string;
  citeEditor: LexicalEditor;
};

const DefaultSourceComp = ({ sourceLink }: SourceCompProps) => <a href={sourceLink}>{sourceLink}</a>;
const DefaultAuthorComp = ({ author }: AuthorCompProps) => {
  return <a href={author.link}>{author.name}</a>;
};

const CiteQuote = ({ authorName, authorLink, sourceContent, sourceLink, citeEditor }: CiteQuoteProps) => {
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
