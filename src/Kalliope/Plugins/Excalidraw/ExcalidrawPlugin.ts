/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR
} from 'lexical';
import { useEffect } from 'react';
import { $createExcalidrawNode, ExcalidrawNode } from '../../Nodes/ExcalidrawNode';
import { INSERT_EXCALIDRAW_COMMAND } from "./ExcalidrawCommand";

export default function ExcalidrawPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    if (!editor.hasNodes([ExcalidrawNode])) {
      throw new Error('ExcalidrawPlugin: ExcalidrawNode not registered on editor');
    }

    return editor.registerCommand(
      INSERT_EXCALIDRAW_COMMAND,
      () => {        
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const excalidrawNode = $createExcalidrawNode();
          selection.insertNodes([excalidrawNode]);
        }

        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);

  return null;
}
