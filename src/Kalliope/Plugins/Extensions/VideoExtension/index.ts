/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {defineImportRule, DOMImportExtension, sel} from '@lexical/html';
import {$insertNodeToNearestRoot} from '@lexical/utils';
import {
  COMMAND_PRIORITY_EDITOR,
  configExtension,
  createCommand,
  defineExtension,
  type LexicalCommand,
} from 'lexical';

import {$createVideoNode, VideoNode} from '../../../Nodes/VideoNode/VideoNode';

export const INSERT_VIDEO_COMMAND: LexicalCommand<string> =
  /* @__PURE__ */ createCommand('INSERT_VIDEO_COMMAND');

const VideoImportRule = /* @__PURE__ */ defineImportRule({
  $import: ctx => [$createVideoNode(ctx.captures.id[0])],
  match: sel
    .tag('iframe')
    .attr('data-lexical-video', /^.+$/, {capture: 'id'}),
  name: '@lexical/playground/video',
});

export const VideoExtension = /* @__PURE__ */ defineExtension({
  dependencies: [
    /* @__PURE__ */ configExtension(DOMImportExtension, {
      rules: [VideoImportRule],
    }),
  ],
  name: '@lexical/playground/Video',
  nodes: [VideoNode],
  register: editor =>
    editor.registerCommand(
      INSERT_VIDEO_COMMAND,
      payload => {
        const videoNode = $createVideoNode(payload);
        $insertNodeToNearestRoot(videoNode);

        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    ),
});
