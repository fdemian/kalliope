 
import type { SerializedLexicalNode, NodeKey, Spread, LexicalNode } from 'lexical';
import { DecoratorNode } from 'lexical';
import Spoiler from './Spoiler';

export type SerializedSpoilerNode = Spread<
  {
    text: string;
    type: 'spoiler';
    version: 1;
  },
  SerializedLexicalNode
>;

export class SpoilerNode extends DecoratorNode<JSX.Element> {
  __text: string;

  static getType():string {
    return 'spoiler';
  }

  static clone(node: SpoilerNode): SpoilerNode {
    return new SpoilerNode(node.__text, node.__key);
  }

  constructor(text: string, key?: NodeKey) {
    super(key);
    this.__text = text;
  }

  createDOM(): HTMLElement {
    return document.createElement('span');
  }

  updateDOM(prevNode: SpoilerNode): boolean {
    // If the inline property changes, replace the element
    return this.__text !== prevNode.__text;
  }

  static importJSON(serializedNode: SerializedSpoilerNode) {
    const node = $createSpoilerNode(serializedNode.text);
    return node;
  }

  exportJSON(): SerializedSpoilerNode {
    return {
      text: this.__text,
      type: 'spoiler',
      version: 1
    };
  }

  decorate(): JSX.Element {
    return <Spoiler text={this.__text} />;
  }
}

export function $createSpoilerNode(text: string = ''): SpoilerNode {
  const spoilerNode = new SpoilerNode(text);
  return spoilerNode;
}

export function $isSpoilerNode(node: LexicalNode): boolean {
  return node instanceof SpoilerNode;
}
