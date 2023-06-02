/* eslint-disable no-use-before-define */
import { ReactNode } from 'react';
import type { LexicalNode, NodeKey } from 'lexical';
import { DecoratorNode, SerializedLexicalNode, Spread } from 'lexical';
import './Keyboard.css';

export type SerializedKeyboardNode = Spread<
  {
    text: string;
    type: 'keyboard';
    version: 1;
  },
  SerializedLexicalNode
>;

export class KeyboardNode extends DecoratorNode<ReactNode> {
  __text: string;

  static getType(): string {
    return 'kbdnode';
  }

  static clone(node: KeyboardNode): KeyboardNode {
    return new KeyboardNode(node.__text, node.__key);
  }

  static importJSON(serializedNode: SerializedKeyboardNode) {
    const node = $createKeyboardNode(serializedNode.text);
    return node;
  }

  exportJSON(): SerializedKeyboardNode {
    return {
      text: this.__text
    };
  }

  constructor(text: string, key?: NodeKey) {
    super(key);
    this.__text = text;
  }

  createDOM(): HTMLElement {
    return document.createElement('span');
  }

  updateDOM(): true {
    return true;
  }

  setText(text) {
    const writable = this.getWritable();
    writable.__text = text;
  }

  decorate(): JSX.Element {
    return <kbd>{this.__text}</kbd>;
  }
}

export function $createKeyboardNode(text: string): KeyboardNode {
  return new KeyboardNode(text);
}

export function $isKeyboardNode(node: LexicalNode): boolean {
  return node instanceof KeyboardNode;
}
