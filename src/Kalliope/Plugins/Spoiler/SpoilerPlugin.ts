/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 */
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createSpoilerNode } from '../../Nodes/Spoiler/SpoilerNode';
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR
} from 'lexical';
import { INSERT_SPOILER_COMMAND } from './SpoilerCommand';
import { useEffect } from 'react';

export default function SpoilerPlugin(): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      INSERT_SPOILER_COMMAND,
      () => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          return false;
        }
        const spoilerNode = $createSpoilerNode(selection.getTextContent());
        selection.insertNodes([spoilerNode]);
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);

  return null;
}
