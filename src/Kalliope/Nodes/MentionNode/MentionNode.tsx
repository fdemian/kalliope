/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 */

import { ReactElement } from 'react';
import type {NodeKey, LexicalNode, Spread, ElementFormatType} from 'lexical';
import { $applyNodeReplacement, $getDocument } from 'lexical';
import {
  DecoratorBlockNode,
  SerializedDecoratorBlockNode,
} from '@lexical/react/LexicalDecoratorBlockNode';
import './MentionNode.css';
export type SerializedMentionNode = Spread<
  {
    mention: string;
    link: string;
    type: string;
    version: number;
  },
  SerializedDecoratorBlockNode
>;


export class MentionNode extends DecoratorBlockNode {
  __mentionName: string;
  __link: string;

  $config() {
    return this.config('mention', {extends: DecoratorBlockNode});
  }

  static importJSON(serializedNode: SerializedMentionNode): MentionNode {
    const node = $createMentionNode(serializedNode.mention, serializedNode.link);
    node.setFormat(serializedNode.format);
    return node;
  }

  exportJSON(): SerializedMentionNode {
    return {
      ...super.exportJSON(),
      mention: this.__mentionName,
      link: this.__link,
      type: "mention",
      version: 1
    };
  }

  static clone(node: MentionNode): MentionNode {
    return new MentionNode(node.__mentionName, node.__link, node.__format,  node.__key);
  }

  constructor(mentionName: string, link: string, format?: ElementFormatType, key?: NodeKey) {
    super(format, key);
    this.__mentionName = mentionName;
    this.__link = link;
  }

  createDOM(): HTMLElement {
    return $getDocument().createElement('span');
  }

  canInsertTextBefore(): boolean {
   return false;
  }

  canInsertTextAfter(): boolean {
   return false;
  }

  decorate(): ReactElement {
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
