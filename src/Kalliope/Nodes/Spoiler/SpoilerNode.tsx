 
import {NodeKey, Spread, LexicalNode, ElementFormatType, $getDocument } from 'lexical';
import { ReactElement } from 'react';
import Spoiler from './Spoiler';
import {DecoratorBlockNode, SerializedDecoratorBlockNode} from "@lexical/react/LexicalDecoratorBlockNode";

export type SerializedSpoilerNode = Spread<
  {
    text: string;
    type: 'spoiler';
    version: 1;
  },
  SerializedDecoratorBlockNode
>;

export class SpoilerNode extends DecoratorBlockNode {
  __text: string;

  $config() {
    return this.config('spoiler', {extends: DecoratorBlockNode});
  }

  static clone(node: SpoilerNode): SpoilerNode {
    return new SpoilerNode(node.__text, node.__format, node.__key);
  }

  constructor(text: string, format?: ElementFormatType, key?: NodeKey) {
    super(format, key);
    this.__text = text;
  }

  createDOM(): HTMLElement {
    return $getDocument().createElement('span');
  }

  static importJSON(serializedNode: SerializedSpoilerNode) {
    const node = $createSpoilerNode(serializedNode.text);
    node.setFormat(serializedNode.format);
    return node;
  }

  exportJSON(): SerializedSpoilerNode {
    return {
      ...super.exportJSON(),
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
