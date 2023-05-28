/* eslint-disable no-use-before-define */
import React from 'react';
import type { EditorConfig, NodeKey } from 'lexical';
import { DecoratorNode } from 'lexical';
import Spoiler from './Spoiler';

export class SpoilerNode extends DecoratorNode<JSX.Element> {
  __text: string;

  static getType() {
    return 'spoiler-inline';
  }

  static clone(node) {
    return new SpoilerNode(node.__text, node.__key);
  }

  constructor(text: string, key?: NodeKey) {
    super(key);
    this.__text = text;
  }

  createDOM(config: EditorConfig): HTMLElement {
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

  static importJSON(serializedNode) {
    const node = $createSpoilerNode(serializedNode.text);
    return node;
  }

  exportJSON() {
    return {
      text: this.__text
    };
  }

  decorate(): JSX.Element {
    return <Spoiler text={this.__text} />;
  }
}

export function $createSpoilerNode(text: string = '') {
  const spoilerNode = new SpoilerNode(text);
  return spoilerNode;
}

export function $isSpoilerNode(node) {
  return node instanceof SpoilerNode;
}
