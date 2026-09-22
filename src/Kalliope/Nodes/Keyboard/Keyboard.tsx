import {ReactElement } from 'react';
import {ElementFormatType, LexicalNode, NodeKey, Spread, $getDocument} from 'lexical';
import {DecoratorBlockNode, SerializedDecoratorBlockNode} from "@lexical/react/LexicalDecoratorBlockNode";
import './Keyboard.css';

export type SerializedKeyboardNode = Spread<
  {
    text: string;
    type: 'keyboard';
    version: 1;
  },
  SerializedDecoratorBlockNode
>;

export class KeyboardNode extends DecoratorBlockNode{
  __text: string;

  $config() {
    return this.config('kbdnode', {extends: DecoratorBlockNode});
  }

  static clone(node: KeyboardNode): KeyboardNode {
    return new KeyboardNode(node.__text, node.__format, node.__key);
  }

  static importJSON(serializedNode: SerializedKeyboardNode) {
    const node = $createKeyboardNode(serializedNode.text);
    node.setFormat(serializedNode.format);
    return node;
  }

  exportJSON(): SerializedKeyboardNode {
    return {
      ...super.exportJSON(),
      text: this.__text,
      type: 'keyboard',
      version: 1
    };
  }

  constructor(text: string, format?: ElementFormatType, key?: NodeKey) {
    super(format, key);
    this.__text = text;
  }

  createDOM(): HTMLElement {
    return $getDocument().createElement('span');
  }

  decorate(): ReactElement {
    return <kbd>{this.__text}</kbd>;
  }
}

export function $createKeyboardNode(text: string): KeyboardNode {
  return new KeyboardNode(text);
}

export function $isKeyboardNode(node: LexicalNode): boolean {
  return node instanceof KeyboardNode;
}
