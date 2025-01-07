/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {ElementNode, LexicalCommand, LexicalNode, NodeKey} from 'lexical';

import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {$insertNodeToNearestRoot, mergeRegister} from '@lexical/utils';
import {
    $createParagraphNode,
    $getNodeByKey,
    COMMAND_PRIORITY_EDITOR,
    createCommand,
} from 'lexical';
import {useEffect} from 'react';

import {
    $createLayoutContainerNode,
    $isLayoutContainerNode,
    LayoutContainerNode,
} from '../../Nodes/Layout/LayoutContainerNode';
import {
    $createLayoutItemNode,
    $isLayoutItemNode,
    LayoutItemNode,
} from '../../Nodes/Layout/LayoutItemNode';
import { INSERT_LAYOUT_COMMAND } from './LayoutCommand';

export const UPDATE_LAYOUT_COMMAND: LexicalCommand<{
    template: string;
    nodeKey: NodeKey;
}> = createCommand<{template: string; nodeKey: NodeKey}>();

function LayoutPlugin(): null {
    const [editor] = useLexicalComposerContext();
    useEffect(() => {
        if (!editor.hasNodes([LayoutContainerNode, LayoutItemNode])) {
            throw new Error(
                'LayoutPlugin: LayoutContainerNode, or LayoutItemNode not registered on editor',
            );
        }

        const $fillLayoutItemIfEmpty = (node: LayoutItemNode) => {
            if (node.isEmpty()) {
              node.append($createParagraphNode());
            }
          };
      
        const $removeIsolatedLayoutItem = (node: LayoutItemNode): boolean => {
            const parent = node.getParent<ElementNode>();
            if (!$isLayoutContainerNode(parent)) {
              const children = node.getChildren<LexicalNode>();
              for (const child of children) {
                node.insertBefore(child);
              }
              node.remove();
              return true;
            }
            return false;
        };

        return mergeRegister(
            editor.registerCommand(
                INSERT_LAYOUT_COMMAND,
                (template) => {
                    editor.update(() => {
                        const container = $createLayoutContainerNode(template);
                        const itemsCount = getItemsCountFromTemplate(template);

                        for (let i = 0; i < itemsCount; i++) {
                            container.append(
                                $createLayoutItemNode().append($createParagraphNode()),
                            );
                        }

                        $insertNodeToNearestRoot(container);
                        container.selectStart();
                    });

                    return true;
                },
                COMMAND_PRIORITY_EDITOR,
            ),
            editor.registerCommand(
                UPDATE_LAYOUT_COMMAND,
                ({template, nodeKey}) => {
                    editor.update(() => {
                        const container = $getNodeByKey<LexicalNode>(nodeKey);

                        if (!$isLayoutContainerNode(container)) {
                            return;
                        }

                        const itemsCount = getItemsCountFromTemplate(template);
                        const prevItemsCount = getItemsCountFromTemplate(
                            container.getTemplateColumns(),
                        );

                        // Add or remove extra columns if new template does not match existing one
                        if (itemsCount > prevItemsCount) {
                            for (let i = prevItemsCount; i < itemsCount; i++) {
                                container.append(
                                    $createLayoutItemNode().append($createParagraphNode()),
                                );
                            }
                        } else if (itemsCount < prevItemsCount) {
                            for (let i = prevItemsCount; i < itemsCount; i++) {
                                const layoutItem = container.getChildAtIndex<LexicalNode>(i);

                                if ($isLayoutItemNode(layoutItem)) {
                                    for (const child of layoutItem.getChildren<LexicalNode>()) {
                                        container.insertAfter(child);
                                    }
                                }
                            }
                        }

                        container.setTemplateColumns(template);
                    });

                    return true;
                },
                COMMAND_PRIORITY_EDITOR,
            ),

            editor.registerNodeTransform(LayoutItemNode, (node) => {    
                // Structure enforcing transformers for each node type. In case nesting structure is not
                // "Container > Item" it'll unwrap nodes and convert it back
                // to regular content.
                const isRemoved = $removeIsolatedLayoutItem(node);
                if (!isRemoved) {
                    // Layout item should always have a child. this function will listen
                    // for any empty layout item and fill it with a paragraph node
                    $fillLayoutItemIfEmpty(node);
                }
            }),
            editor.registerNodeTransform(LayoutContainerNode, (node) => {
                const children = node.getChildren<LexicalNode>();
                if (!children.every($isLayoutItemNode)) {
                    for (const child of children) {
                        node.insertBefore(child);
                    }
                    node.remove();
                }
            }),
        );
    }, [editor]);

    return null;
}

function getItemsCountFromTemplate(template: string): number {
    return template.trim().split(/\s+/).length;
}

export default LayoutPlugin;