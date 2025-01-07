import type { NodeKey, SerializedLexicalNode, Spread, LexicalNode } from 'lexical';
import { $applyNodeReplacement, DecoratorNode } from 'lexical';
import EmojiImage from './EmojiImage';

export type SerializedEmojiNode = Spread<
  {
    emoji: string;
    type: string;
    version: number;
  },
  SerializedLexicalNode
>;

export class EmojiNode extends DecoratorNode<JSX.Element> {
  __emoji: string;

  static getType() {
    return 'emoji';
  }

  static importJSON(serializedNode: SerializedEmojiNode): EmojiNode {
    return $createEmojiNode(serializedNode.emoji).updateFromJSON(serializedNode);
  }

  exportJSON(): SerializedEmojiNode {
    return {
      emoji: this.__emoji,
      type: 'emoji',
      version: 1,
    };
  }

  static clone(node: EmojiNode) {
    return new EmojiNode(node.__emoji, node.__key);
  }

  constructor(emoji: string, key?: NodeKey) {
    super(key);
    this.__emoji = emoji;
  }

  createDOM(): HTMLElement {
    return document.createElement('span');
  }

  updateDOM(prevNode: EmojiNode) {
    return this.__emoji !== prevNode.__emoji;
  }

  decorate(): JSX.Element {
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
