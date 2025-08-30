/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { $getNodeByKey, NodeKey } from 'lexical';
import type { TextNode } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalTypeaheadMenuPlugin } from '@lexical/react/LexicalTypeaheadMenuPlugin';
import { MentionNode, $createMentionNode } from '../../Nodes/MentionNode/MentionNode';
import { MentionsTypeaheadMenuItem, EntryComponentType } from './MentionsTypeaheadMenuItem';
import MentionTypeaheadOption from './MentionTypeaheadOption';
import { createPortal } from 'react-dom';
import { ReactElement, useCallback, useEffect } from 'react';
import { getPossibleQueryMatch } from './utils';
import { type MentionItem } from '../../KalliopeEditorTypes';

// At most, 5 suggestions are shown in the popup.
const SUGGESTION_LIST_LENGTH_LIMIT = 5;

type MentionFnProps = {
  id: number;
  name: string;
  link: string;
  avatar?: string | null;
}

type MentionPluginProps = {
  config: {
    onAddMention: (arg: MentionFnProps) => void;
    onRemoveMention: (arg: MentionFnProps) => void;
    mentionsData: MentionItem[];
    onSearchChange: (match: string | null) => void;
    entryComponent: EntryComponentType;
  }
}

type ItemToTypeAhead = (item:MentionItem) => MentionTypeaheadOption;

const convertItemToTypeAheadOption:ItemToTypeAhead = (item)  => {
  return {
    name: item.name,
    link: item.link,
    avatar: item.avatar ?? "",
    key: item.name,
    setRefElement: () => {}
  }
}

export default function NewMentionsPlugin({ config }: MentionPluginProps): ReactElement | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const mentionNodeList = new Map<NodeKey, MentionNode>();

    if (!editor.hasNodes([MentionNode])) {
      throw new Error('MentionsPlugin: MentionNode not registered on editor');
    }

    return editor.registerMutationListener(MentionNode, (nodeMutations) => {
      for (const [nodeKey, mutation] of nodeMutations) {
        if (mutation === 'created') {
          editor.update(() => {
            const mentionNode = $getNodeByKey<MentionNode>(nodeKey);
            if(mentionNode != null){
              mentionNodeList.set(nodeKey, mentionNode);
              if (config.onAddMention) {
                config.onAddMention({
                  id: 0, // Unused param (for now)
                  name: mentionNode.__mentionName,
                  link: mentionNode.__link,
                });
              }
            }
          });
        } else if (mutation === 'destroyed') {
          const mentionNode = mentionNodeList.get(nodeKey);
          if (mentionNode !== undefined) {
            config.onRemoveMention({
              id: 0,// Unused param (for now)              
              name: mentionNode.__mentionName,
              link: mentionNode.__link,
            });
            mentionNodeList.delete(nodeKey);
          }
        }
      }
    });
  }, [editor, config]);

  const options = config.mentionsData.slice(0, SUGGESTION_LIST_LENGTH_LIMIT);

  const onSelectOption = useCallback(
    (
      selectedOption: MentionTypeaheadOption,
      nodeToReplace: TextNode | null,
      closeMenu: () => void
    ) => {
      editor.update(() => {
        const mentionNode = $createMentionNode(selectedOption.name, selectedOption.link);
        if (nodeToReplace) {
          nodeToReplace.replace(mentionNode);
        }
        closeMenu();
      });
    },
    [editor]
  );

  const checkForMentionMatch = useCallback((text: string) => {
    const mentionMatch = getPossibleQueryMatch(text);
    return mentionMatch;
  }, []);

  return (
    <LexicalTypeaheadMenuPlugin<MentionTypeaheadOption>
      onQueryChange={config.onSearchChange}
      onSelectOption={onSelectOption}
      triggerFn={checkForMentionMatch}
      options={options.map(o => convertItemToTypeAheadOption(o))}
      menuRenderFn={(
        anchorElementRef,
        { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }
      ) =>
        anchorElementRef.current && config.mentionsData.length
          ? createPortal(
              <div className="typeahead-popover mentions-menu">
                <ul>
                  {config.mentionsData.map((option:MentionItem, i: number) => (
                    <MentionsTypeaheadMenuItem
                      entryComponent={config.entryComponent}
                      index={i}
                      isSelected={selectedIndex === i}
                      onClick={() => {
                        setHighlightedIndex(i);
                        selectOptionAndCleanUp(convertItemToTypeAheadOption(option));
                      }}
                      onMouseEnter={() => {
                        setHighlightedIndex(i);
                      }}
                      key={option.link}
                      option={convertItemToTypeAheadOption(option)}
                    />
                  ))}
                </ul>
              </div>,
              anchorElementRef.current
            )
          : null
      }
    />
  );
}
