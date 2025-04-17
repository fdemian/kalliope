/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  LexicalTypeaheadMenuPlugin,
  useBasicTypeaheadTriggerMatch,
} from '@lexical/react/LexicalTypeaheadMenuPlugin';
import { $getSelection, $isRangeSelection, TextNode } from 'lexical';
import { useCallback, useEffect, useContext, useMemo, useState, ReactElement } from 'react';
import * as ReactDOM from 'react-dom';
import { ReactPortal } from 'react';
import EmojiMenuItem from './EmojiMenuItem';
import EmojiOption from './EmojiOption';
import { $createEmojiNode, EmojiNode } from '../../Nodes/EmojiNode/EmojiNode';
import { priorityList, emojiMatch, Emoji } from './utils';
import { CalliopeContext } from '../../context';
import defaultData from 'emojibase-data/en/data.json';

const MAX_EMOJI_SUGGESTION_COUNT = 5;

export default function EmojiPickerPlugin() {
  const [editor] = useLexicalComposerContext();
  const [queryString, setQueryString] = useState<string | null>(null);
  const [emojis, setEmojis] = useState<Emoji[]>([]);
  const [initialData, setInitialData] = useState<Emoji[]>([]);
  const calliopeConfig = useContext(CalliopeContext);

  let emojiData = defaultData;

  if(calliopeConfig !== null) {
    const { config } = calliopeConfig;
    if(config.emojiConfig && config.emojiConfig.emojiData) {
      emojiData = calliopeConfig.config.emojiConfig.emojiData;
    }
  }

  useEffect(() => {
    if (!editor.hasNodes([EmojiNode])) {
      throw new Error('EmojiPlugin: EmojiNode not registered on editor');
    }

    const initialEmojiData = emojiData.filter((e) => priorityList.includes(e.hexcode));
    setEmojis(initialEmojiData);
    setInitialData(initialEmojiData);
  }, [editor, emojiData]);

  const onQueryChange = (query: string | null) => {
    let _emojis = initialData;
    if (query && query.length !== 0) {
      const filteredData = emojiData.filter((e) => emojiMatch(e, query));
      if (filteredData.length > 0) {
        _emojis = filteredData;
      } else {
        _emojis = emojis.length > 0 ? emojis : initialData;
      }
    }
    setEmojis(_emojis);
    setQueryString(query);
  };

  const emojiOptions = useMemo(
    () =>
      emojis != null
        ? emojis.map(
            ({ label, emoji, tags }) =>
              new EmojiOption(label, emoji, {
                keywords: [...(tags ?? []), label],
              })
          )
        : [],
    [emojis]
  );

  const checkForTriggerMatch = useBasicTypeaheadTriggerMatch(':', {
    minLength: 0,
  });

  const options: EmojiOption[] = useMemo(() => {
    return emojiOptions
      .filter((option: EmojiOption) => {
        return queryString != null
          ? new RegExp(queryString, 'gi').exec(option.title) || option.keywords != null
            ? option.keywords.some((keyword: string) =>
                new RegExp(queryString, 'gi').exec(keyword)
              )
            : false
          : emojiOptions;
      })
      .slice(0, MAX_EMOJI_SUGGESTION_COUNT);
  }, [emojiOptions, queryString]);

  const onSelectOption = useCallback(
    (
      selectedOption: EmojiOption,
      nodeToRemove: TextNode | null,
      closeMenu: () => void
    ) => {
      editor.update(() => {
        const selection = $getSelection();

        if (!$isRangeSelection(selection) || selectedOption == null) {
          return;
        }

        if (nodeToRemove) {
          nodeToRemove.remove();
        }

        const emojiNode = $createEmojiNode(selectedOption.emoji);
        selection.insertNodes([emojiNode]);
        closeMenu();
      });
    },
    [editor]
  );

  return (
    <LexicalTypeaheadMenuPlugin
      onQueryChange={onQueryChange}
      onSelectOption={onSelectOption}
      triggerFn={checkForTriggerMatch}
      options={options}
      menuRenderFn={(
        anchorElementRef,
        { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }
      ): ReactElement | ReactPortal | null => {
        if (anchorElementRef == null || options.length === 0) {
          return null;
        }

        return anchorElementRef.current && options.length
          ? ReactDOM.createPortal(
              <div className="typeahead-popover emoji-menu">
                <ul>
                  {options.map((option: EmojiOption, index) => (
                    <div key={option.key}>
                      <EmojiMenuItem
                        index={index}
                        isSelected={selectedIndex === index}
                        onClick={() => {
                          setHighlightedIndex(index);
                          selectOptionAndCleanUp(option);
                        }}
                        onMouseEnter={() => {
                          setHighlightedIndex(index);
                        }}
                        option={option}
                      />
                    </div>
                  ))}
                </ul>
              </div>,
              anchorElementRef.current
            )
          : null;
      }}
    />
  );
}
