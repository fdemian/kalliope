/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {$insertNodeToNearestRoot} from '@lexical/utils';
import { COMMAND_PRIORITY_EDITOR } from 'lexical';
import { ReactElement, useEffect} from 'react';
import {$createFigmaNode, FigmaNode} from '../../Nodes/FigmaNode/FigmaNode';
import { INSERT_FIGMA_COMMAND } from './FigmaCommand';

export default function FigmaPlugin(): ReactElement | null {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        if (!editor.hasNodes([FigmaNode])) {
            throw new Error('FigmaPlugin: FigmaNode not registered on editor');
        }

        return editor.registerCommand<string>(
            INSERT_FIGMA_COMMAND,
            (payload) => {
                const match =
                    /https:\/\/([\w.-]+\.)?figma.com\/(file|proto)\/([0-9a-zA-Z]{22,128})(?:\/.*)?$/.exec(
                        payload,
                    );
                const FIGMA_ID:string = match ? match[3] : "";

                const figmaNode = $createFigmaNode(FIGMA_ID);
                $insertNodeToNearestRoot(figmaNode);
                return true;
            },
            COMMAND_PRIORITY_EDITOR,
        );
    }, [editor]);

    return null;
}