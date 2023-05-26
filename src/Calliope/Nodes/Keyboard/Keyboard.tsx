/* eslint-disable no-use-before-define */
import React, { ReactNode } from 'react';
import type { LexicalNode, NodeKey } from 'lexical';
import { DecoratorNode } from 'lexical';
import './Keyboard.css';

export class KeyboardNode extends DecoratorNode<ReactNode> {
  __text: string;

  static getType(): string {
    return 'kbdnode';
  }

  static clone(node: KeyboardNode): KeyboardNode {
    return new KeyboardNode(node.__text, node.__key);
  }

  static importJSON(serializedNode) {
    const node = $createKeyboardNode(serializedNode.text);
    return node;
  }

  exportJSON() {
    return {
      text: this.__text,
      type: 'kbdnode',
      version: 1,
    };
  }

  constructor(text: string, key?: NodeKey) {
    super(key);
    this.__text = text;
  }

  createDOM(): HTMLElement {
    return document.createElement('span');
  }

  updateDOM(prevNode) {
    // If the inline property changes, replace the element
    return this.__text !== prevNode.__text;
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
