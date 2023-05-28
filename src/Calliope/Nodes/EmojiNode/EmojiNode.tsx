/* eslint-disable no-use-before-define */
import React from 'react';
import type { EditorConfig, NodeKey, SerializedLexicalNode, Spread } from 'lexical';
import { $applyNodeReplacement, DecoratorNode } from 'lexical';
import EmojiImage from './EmojiImage';

export type SerializedEmojiNode = Spread<
  {
    emoji: string;
  },
  SerializedLexicalNode
>;

export class EmojiNode extends DecoratorNode {
  __emoji: string;

  static getType() {
    return 'emoji';
  }

  static importJSON(serializedNode: SerializedEmojiNode): EmojiNode {
    const node = $createEmojiNode(serializedNode.emoji);
    return node;
  }

  exportJSON(): SerializedEmojiNode {
    return {
      emoji: this.__emoji,
      type: 'emoji',
      version: 1,
    };
  }

  static clone(node) {
    return new EmojiNode(node.__emoji, node.__key);
  }

  constructor(emoji: string, key?: NodeKey) {
    super(key);
    this.__emoji = emoji;
  }

  createDOM(config: EditorConfig): HTMLElement {
    return document.createElement('span');
  }

  updateDOM(prevNode) {
    return this.__emoji !== prevNode.__emoji;
  }

  decorate(): JSX.Element {
    return <EmojiImage emoji={this.__emoji} />;
  }
}

export function $createEmojiNode(emoji) {
  const emojiNode = new EmojiNode(emoji);
  return $applyNodeReplacement(emojiNode);
}

export function $isEmojiNode(node) {
  return node instanceof EmojiNode;
}
