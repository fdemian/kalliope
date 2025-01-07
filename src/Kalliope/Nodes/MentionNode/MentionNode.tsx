/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 */
 
import type { SerializedLexicalNode, NodeKey, LexicalNode, Spread } from 'lexical';
import { $applyNodeReplacement, DecoratorNode } from 'lexical';
import './MentionNode.css';

export type SerializedMentionNode = Spread<
  {
    mention: string;
    link: string;
    type: string;
    version: number;
  },
  SerializedLexicalNode
>;

export class MentionNode extends DecoratorNode<JSX.Element> {
  __mentionName: string;
  __link: string;

  static getType(): string {
    return 'mention';
  }

  static importJSON(serializedNode: SerializedMentionNode): MentionNode {
    return $createMentionNode(serializedNode.mention, serializedNode.link).updateFromJSON(
      serializedNode
    );
  }

  exportJSON(): SerializedMentionNode {
    return {
      mention: this.__mentionName,
      link: this.__link,
      type: "mention",
      version: 1
    };
  }

  static clone(node: MentionNode): MentionNode {
    return new MentionNode(node.__mentionName, node.__link, node.__key);
  }

  constructor(mentionName: string, link: string, key?: NodeKey) {
    super(key);
    this.__mentionName = mentionName;
    this.__link = link;
  }

  createDOM(): HTMLElement {
    return document.createElement('span');
  }

  updateDOM(): false {
    return false;
  }

  canInsertTextBefore(): boolean {
   return false;
  }

  canInsertTextAfter(): boolean {
   return false;
  }

  decorate(): JSX.Element {
    return (
      <a href={this.__link} className="user-mention" spellCheck="false">
        @{this.__mentionName}
      </a>
    );
  }
}

export function $createMentionNode(mentionName: string, link: string): MentionNode {
  const mentionNode = new MentionNode(mentionName, link);
  return $applyNodeReplacement(mentionNode);
}

export function $isMentionNode(node: LexicalNode): boolean {
  return node instanceof MentionNode;
}
