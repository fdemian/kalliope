/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $insertNodeToNearestRoot } from '@lexical/utils';
import { COMMAND_PRIORITY_EDITOR } from 'lexical';
import { ReactElement, useEffect } from 'react';
import { $createInstagramNode, InstagramNode } from '../../Nodes/InstagramNode/Index';
import { INSERT_INSTAGRAM_COMMAND } from './InstagramCommands';

export default function InstagramPlugin(): ReactElement | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([InstagramNode])) {
      throw new Error('InstagramPlugin: InstagramNode not registered on editor');
    }

    return editor.registerCommand<string>(
        INSERT_INSTAGRAM_COMMAND,
      (payload) => {
        const igNode = $createInstagramNode(payload);
        $insertNodeToNearestRoot(igNode);

        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);

  return null;
}