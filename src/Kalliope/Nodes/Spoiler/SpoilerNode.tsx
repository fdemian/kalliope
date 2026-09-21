 
import type { SerializedLexicalNode, NodeKey, Spread, LexicalNode } from 'lexical';
import { DecoratorNode } from 'lexical';
import { ReactElement } from 'react';
import Spoiler from './Spoiler';
import {DecoratorBlockNode} from "@lexical/react/LexicalDecoratorBlockNode";

export type SerializedSpoilerNode = Spread<
  {
    text: string;
    type: 'spoiler';
    version: 1;
  },
  SerializedLexicalNode
>;

export class SpoilerNode extends DecoratorNode<ReactElement> {
  __text: string;

  $config() {
    return this.config('spoiler', {extends: DecoratorBlockNode});
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

  decorate(): ReactElement {
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
