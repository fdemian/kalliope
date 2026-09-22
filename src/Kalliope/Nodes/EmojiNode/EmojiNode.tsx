import {NodeKey, Spread, LexicalNode, ElementFormatType, $applyNodeReplacement, $getDocument} from 'lexical';
import EmojiImage from './EmojiImage';
import { ReactElement } from 'react';
import {DecoratorBlockNode, SerializedDecoratorBlockNode} from "@lexical/react/LexicalDecoratorBlockNode";

export type SerializedEmojiNode = Spread<
  {
    emoji: string;
    type: string;
    version: number;
  },
  SerializedDecoratorBlockNode
>;

export class EmojiNode extends DecoratorBlockNode {
  __emoji: string;

  $config() {
    return this.config('emoji', {extends: DecoratorBlockNode});
  }

  static importJSON(serializedNode: SerializedEmojiNode): EmojiNode {
    const node = $createEmojiNode(serializedNode.emoji);
    node.setFormat(serializedNode.format);
    return node;
  }

  exportJSON(): SerializedEmojiNode {
    return {
      ...super.exportJSON(),
      emoji: this.__emoji,
      type: 'emoji',
      version: 1,
    };
  }

  static clone(node: EmojiNode) {
    return new EmojiNode(node.__emoji, node.__format, node.__key);
  }

  constructor(emoji: string, format?: ElementFormatType, key?: NodeKey) {
    super(format, key);
    this.__emoji = emoji;
  }

  createDOM(): HTMLElement {
    return $getDocument().createElement('span');
  }

  decorate(): ReactElement {
    return <EmojiImage emoji={this.__emoji} />;
  }
}

export function $createEmojiNode(emoji: string): EmojiNode {
  const emojiNode = new EmojiNode(emoji);
  return $applyNodeReplacement(emojiNode);
}

export function $isEmojiNode(node: LexicalNode) {
  return node instanceof EmojiNode;
}
