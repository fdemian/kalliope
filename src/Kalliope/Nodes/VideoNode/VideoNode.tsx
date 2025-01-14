/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 */
 
import type {
  ElementFormatType,
  LexicalNode,
  LexicalEditor,
  EditorConfig,
  NodeKey,
  Spread
} from 'lexical';
import { BlockWithAlignableContents } from '@lexical/react/LexicalBlockWithAlignableContents';
import {
  DecoratorBlockNode,
  SerializedDecoratorBlockNode,
} from '@lexical/react/LexicalDecoratorBlockNode';

import ReactPlayer from 'react-player';
import './VideoNode.css';

type VideoPropsNode = {
  format: ElementFormatType;
  nodeKey: NodeKey;
  videoURL: string;
  className: {
    base: string;
    focus: string;
  }
}

export type SerializedVideoNode = Spread<
  {
    videoURL: string;
    format: ElementFormatType;
    type: 'video';
    version: 1;
  },
  SerializedDecoratorBlockNode
>;

function VideoComponent({ format, nodeKey, videoURL, className }: VideoPropsNode) {
  return (
    <BlockWithAlignableContents
      format={format}
      nodeKey={nodeKey}
      className={className}
    >
      <div className="player-wrapper">
        <ReactPlayer
          className="react-player"
          url={videoURL}
          controls={true}
          width="100%"
          height="100%"
        />
      </div>
    </BlockWithAlignableContents>
  );
}

export class VideoNode extends DecoratorBlockNode {
  __url: string;

  static getType(): string {
    return 'video';
  }

  static clone(node: VideoNode): VideoNode {
    return new VideoNode(node.__url, node.__format, node.__key);
  }

  constructor(url: string, format?: ElementFormatType, key?: NodeKey) {
    super(format, key);
    this.__url = url;
  }

  updateDOM(): false {
    return false;
  }

  static importJSON(serializedNode: SerializedVideoNode) {
    return $createVideoNode(serializedNode.videoURL).updateFromJSON(serializedNode);
  }

  exportJSON(): SerializedVideoNode {
    return {
      videoURL: this.__url,
      format: this.__format,
      type: 'video',
      version: 1
    };
  }

  createDOM(): HTMLElement {
    const span = document.createElement('span');
    return span;
  }

  // @ts-ignore
  decorate(editor: LexicalEditor, config: EditorConfig): JSX.Element {
    const embedBlockTheme = config.theme.embedBlock || {};
    const className = {
      base: embedBlockTheme.base || '',
      focus: embedBlockTheme.focus || '',
    };
    return (
      <VideoComponent
        className={className}
        format={this.__format}
        nodeKey={this.getKey()}
        videoURL={this.__url}
      />
    );
  }
}

export function $createVideoNode(videoURL: string): VideoNode {
  return new VideoNode(videoURL);
}

export function $isVideoNode(node: LexicalNode): boolean {
  return node instanceof VideoNode;
}
