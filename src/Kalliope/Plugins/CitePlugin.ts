/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 */

import type { LexicalCommand } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
} from 'lexical';
import { useEffect } from 'react';
import { $createCiteNode, CiteNode } from '../Nodes/CiteNode/CiteNode';

export const INSERT_CITE_QUOTE: LexicalCommand<string> = createCommand();

export default function CitePlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([CiteNode])) {
      throw new Error('CitePlugin: CiteNode not registered on editor');
    }

    return editor.registerCommand(
      INSERT_CITE_QUOTE,
      (payload: any) => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const citeNode = $createCiteNode(payload.author, payload.source);
          selection.insertNodes([citeNode]);
        }
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);

  return null;
}
