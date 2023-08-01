// @ts-nocheck
import type { LexicalEditor, LexicalNode, NodeKey, Spread } from 'lexical';
import { createEditor } from 'lexical';
import CiteQuote from './CiteQuote';
import { BlockWithAlignableContents } from '@lexical/react/LexicalBlockWithAlignableContents';
import {
    DecoratorBlockNode,
    SerializedDecoratorBlockNode,
} from '@lexical/react/LexicalDecoratorBlockNode';

export type SerializedCiteNode = Spread<
    {
        authorName: string;
        authorLink: string;
        authorAvatar: string;
        sourceContent: string;
        sourceLink: string;
    },
    SerializedDecoratorBlockNode
>;

type Author = {
    name: string;
    link: string;
    avatar?: string;
};

type Source = {
    content?: LexicalEditor;
    link: string;
};

export class CiteNode extends DecoratorBlockNode {
    __id: string = '';
    __authorName: string;
    __authorLink: string;
    __authorAvatar?: string;
    __sourceContent: string;
    __sourceLink: string;

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
    }

    exportJSON(): SerializedCiteNode {
        const serializedAvatar =
            this.__authorAvatar !== null &&
            this.__authorAvatar !== undefined ? this.__authorAvatar : '';

        return {
            authorName: this.__authorName,
            authorLink: this.__authorLink,
            authorAvatar: serializedAvatar,
            sourceContent: this.__sourceContent,
            sourceLink: this.__sourceLink,
            type: 'cite-node',
            version: 1
        };
    }

    static importJSON(serializedNode: SerializedCiteNode): CiteNode {
        const author = {
            name: serializedNode.authorName,
            link: serializedNode.authorLink,
            avatar: serializedNode.authorAvatar,
        };
        const source = {
            content: serializedNode.sourceContent,
            link: serializedNode.sourceLink,
        };


        const node = $createCiteNode(author, source);
        console.clear();
        console.log(serializedNode);
        console.log("LLLLLLL");
        /*
        const nestedEditor = node.__sourceContent;
        const editorState = nestedEditor.parseEditorState(serializedNode.sourceContent);
        if (!editorState.isEmpty()) {
          nestedEditor.setEditorState(editorState);
        }
        */

        return node;
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