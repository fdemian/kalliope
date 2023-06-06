/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { $getNodeByKey } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalTypeaheadMenuPlugin } from '@lexical/react/LexicalTypeaheadMenuPlugin';
import { MentionNode, $createMentionNode } from '../../Nodes/MentionNode/MentionNode';
import { MentionsTypeaheadMenuItem } from './MentionsTypeaheadMenuItem';
import MentionTypeaheadOption from './MentionTypeaheadOption';
import { createPortal } from 'react-dom';
import { useCallback, useEffect } from 'react';
import { getPossibleQueryMatch } from './utils';
import { MentionItem } from '../../../Calliope/CalliopeEditorTypes';

// At most, 5 suggestions are shown in the popup.
const SUGGESTION_LIST_LENGTH_LIMIT = 5;

type AvatarEntryComponent = {
  name: string;
}

type MentionFnProps = {
  name: string;
  link: string;
}

type MentionPluginProps = {
  config: {
    onAddMention: (arg: MentionFnProps) => void;
    onRemoveMention: (arg: MentionFnProps) => void;
    mentionsData: MentionItem[];
    onSearchChange: (match: string) => void;
    entryComponent: (arg: AvatarEntryComponent) => JSX.Element;
  }
}

const onQueryChange = (query: string) => {};

export default function NewMentionsPlugin({ config }: MentionPluginProps): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const mentionNodeList = new Map<NodeKey, TableSelection>();

    if (!editor.hasNodes([MentionNode])) {
      throw new Error('MentionsPlugin: MentionNode not registered on editor');
    }

    return editor.registerMutationListener(MentionNode, (nodeMutations) => {
      for (const [nodeKey, mutation] of nodeMutations) {
        if (mutation === 'created') {
          editor.update(() => {
            const mentionNode = $getNodeByKey<MentionNode>(nodeKey);
            mentionNodeList.set(nodeKey, mentionNode);
            if (config.onAddMention) {
              config.onAddMention({
                name: mentionNode.__mentionName,
                link: mentionNode.__link,
              });
            }
          });
        } else if (mutation === 'destroyed') {
          const mentionNode = mentionNodeList.get(nodeKey);
          if (mentionNode !== undefined) {
            config.onRemoveMention({
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
      onQueryChange={onQueryChange}
      onSelectOption={onSelectOption}
      triggerFn={checkForMentionMatch}
      options={options}
      menuRenderFn={(
        anchorElementRef,
        { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }
      ) =>
        anchorElementRef.current && config.mentionsData.length
          ? createPortal(
              <div className="typeahead-popover mentions-menu">
                <ul>
                  {config.mentionsData.map((option, i: number) => (
                    <MentionsTypeaheadMenuItem
                      entryComponent={config.entryComponent}
                      index={i}
                      isSelected={selectedIndex === i}
                      onClick={() => {
                        setHighlightedIndex(i);
                        selectOptionAndCleanUp(option);
                      }}
                      onMouseEnter={() => {
                        setHighlightedIndex(i);
                      }}
                      key={option.key}
                      option={option}
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
