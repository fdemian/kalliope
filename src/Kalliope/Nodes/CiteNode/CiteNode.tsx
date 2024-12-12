// @ts-nocheck
import type { LexicalEditor, LexicalNode, NodeKey, Spread } from 'lexical';
import CiteQuote from './CiteQuote';
import { BlockWithAlignableContents } from '@lexical/react/LexicalBlockWithAlignableContents';
import {createEditor, SerializedEditorState, DecoratorNode, SerializedLexicalNode} from "lexical";

export type SerializedCiteNode = Spread<
    {
        authorName: string;
        authorLink: string;
        authorAvatar: string;
        sourceContent: string | object;
        sourceLink: string;
    },
    SerializedLexicalNode
>;

type Author = {
    name: string;
    link: string;
    avatar?: string;
};

type Source = {
    content?: string | SerializedEditorState;
    link: string;
};

export class CiteNode extends DecoratorNode<JSX.Element> {
    __id: string = '';
    __authorName: string;
    __authorLink: string;
    __authorAvatar?: string;
    __sourceContent: string;
    __sourceLink: string;
    __initialEditor: LexicalEditor;

    static clone(node: CiteNode): CiteNode {
        const author: Author = {
            name: node.__authorName,
            link: node.__authorLink,
            avatar: node.__authorAvatar,
        };
        const source: Source = {
            content: node.__sourceContent,
            link: node.__sourceLink,
        };

        return new CiteNode(author, source, node.__key);
    }

    static getType(): string {
        return 'cite-node';
    }

    constructor(author: Author, source: Source, key?: NodeKey) {
        super(key);
        // Initialization.
        this.__authorName = author.name;
        this.__authorLink = author.link;
        this.__authorAvatar = author.avatar;
        this.__sourceLink = source.link;
        this.__sourceContent = source.content;
        this.__initialEditor = createEditor();
    }

    exportJSON(): SerializedCiteNode {
        const serializedAvatar =
            this.__authorAvatar !== null &&
            this.__authorAvatar !== undefined ? this.__authorAvatar : '';

        return {
            authorName: this.__authorName,
            authorLink: this.__authorLink,
            authorAvatar: serializedAvatar,
            sourceContent: JSON.stringify(this.__initialEditor.toJSON()),
            sourceLink: this.__sourceLink,
            type: 'cite-node',
            version: 1
        };
    }

    static importJSON(serializedNode: SerializedCiteNode): CiteNode {
        let parsedContent;
        if(typeof serializedNode.sourceContent === 'string'){
            parsedContent = JSON.parse(serializedNode.sourceContent);
        }
        else {
            parsedContent = serializedNode.sourceContent;
        }
        const author = {
            name: serializedNode.authorName,
            link: serializedNode.authorLink,
            avatar: serializedNode.authorAvatar,
        };
        const source = {
            content: JSON.stringify(parsedContent.editorState),
            link: serializedNode.sourceLink,
        };
        return $createCiteNode(author, source);
    }

    createDOM(): HTMLElement {
        return document.createElement('div');
    }

    updateDOM(): false {
        return false;
    }

    decorate(): JSX.Element {
      return (
      <BlockWithAlignableContents
        format={this.__format}
        nodeKey={this.getKey()}
        className={{ base: '', focus: '' }}
      >
        <CiteQuote
           authorName={this.__authorName}
           authorLink={this.__authorLink}
           sourceLink={this.__sourceLink}
           content={this.__sourceContent}
           initialEditor={this.__initialEditor}
        />
      </BlockWithAlignableContents>
      );
    }
}

export function $createCiteNode(author: Author, source: Source): CiteNode {
    return new CiteNode(author, source);
}

export function $isCiteNode(node: LexicalNode): boolean {
    return node instanceof CiteNode;
}