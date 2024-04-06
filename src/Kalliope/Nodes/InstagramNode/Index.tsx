/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  ElementFormatType,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  Spread,
} from 'lexical';
import {
  DecoratorBlockNode,
  SerializedDecoratorBlockNode,
} from '@lexical/react/LexicalDecoratorBlockNode';
import './InstagramNode.css';
import { BlockWithAlignableContents } from '@lexical/react/LexicalBlockWithAlignableContents';

function convertTweetElement(domNode: HTMLDivElement): DOMConversionOutput | null {
  const id = domNode.getAttribute('data-lexical-tweet-id');
  if (id) {
    const node = $createInstagramNode(id);
    return { node };
  }
  return null;
}

export type SerializedTweetNode = Spread<
  {
    url: string;
    type: 'instagram';
    version: 1;
  },
  SerializedDecoratorBlockNode
>;

export class InstagramNode extends DecoratorBlockNode {
  __url: string;

  static getType(): string {
    return 'instagram';
  }

  static clone(node: InstagramNode): InstagramNode {
    return new InstagramNode(node.__url, node.__format, node.__key);
  }

  static importJSON(serializedNode: SerializedTweetNode): InstagramNode {
    const node = $createInstagramNode(serializedNode.url);
    node.setFormat(serializedNode.format);
    return node;
  }

  exportJSON(): SerializedTweetNode {
    return {
      ...super.exportJSON(),
      id: this.getId(),
      type: 'instagram',
      version: 1,
    };
  }

  static importDOM(): DOMConversionMap<HTMLDivElement> | null {
    return {
      div: (domNode: HTMLDivElement) => {
        if (!domNode.hasAttribute('data-lexical-tweet-id')) {
          return null;
        }
        return {
          conversion: convertTweetElement,
          priority: 2,
        };
      },
    };
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('div');
    element.setAttribute('data-lexical-tweet-id', this.__url);
    const text = document.createTextNode(this.getTextContent());
    element.append(text);
    return { element };
  }

  constructor(id: string, format?: ElementFormatType, key?: NodeKey) {
    super(format, key);
    this.__url = id;
  }

  getId(): string {
    return this.__url;
  }

  getTextContent(): string {
    return this.__url;
  }

  // @ts-ignore
  decorate(editor: LexicalEditor, config: EditorConfig): JSX.Element {
    const embedBlockTheme = config.theme.embedBlock || {};
    const className = {
      base: embedBlockTheme.base || '',
      focus: embedBlockTheme.focus || '',
    };

    return (
    <BlockWithAlignableContents
      className={className}
      format={this.__format}
      nodeKey={this.getKey()}
    >
      <iframe className='instagram-node' src={this.__url}></iframe>
    </BlockWithAlignableContents>
    );
  }

}

export function $createInstagramNode(instagramURL: string): InstagramNode {
  return new InstagramNode(instagramURL);
}

export function $isInstagramNode(
  node: InstagramNode | LexicalNode | null | undefined
): node is InstagramNode {
  return node instanceof InstagramNode;
}
