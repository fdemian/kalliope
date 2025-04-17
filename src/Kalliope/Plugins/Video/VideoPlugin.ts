/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 */
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { COMMAND_PRIORITY_EDITOR } from 'lexical';
import { useEffect } from 'react';
import { $insertNodeToNearestRoot } from '@lexical/utils';
import { $createVideoNode, VideoNode } from '../../Nodes/VideoNode/VideoNode';
import { INSERT_VIDEO_COMMAND } from './VideoCommand';
import type {ReactElement} from 'react';

export default function VideoPlugin(): ReactElement | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([VideoNode])) {
      throw new Error('VideoPlugin: VideoNode not registered on editor');
    }

    return editor.registerCommand<string>(
      INSERT_VIDEO_COMMAND,
      (payload) => {
        const videoNode = $createVideoNode(payload);
        $insertNodeToNearestRoot(videoNode);
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);

  return null;
}
