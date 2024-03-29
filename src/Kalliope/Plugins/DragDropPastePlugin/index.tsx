/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { CalliopeContext } from '../../context';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { DRAG_DROP_PASTE } from '@lexical/rich-text';
import { COMMAND_PRIORITY_LOW } from 'lexical';
import { useEffect, useContext } from 'react';

import { INSERT_IMAGE_COMMAND } from '../ImagesPlugin/ImagesCommand';

const ACCEPTABLE_IMAGE_TYPES = [
  'image/',
  'image/heic',
  'image/heif',
  'image/gif',
  'image/webp',
];

function isAcceptableImageType(type: string): boolean {
  for (const acceptableType of ACCEPTABLE_IMAGE_TYPES) {
    if (type.startsWith(acceptableType)) {
      return true;
    }
  }
  return false;
}

export default function DragDropPaste(): null {
  const [editor] = useLexicalComposerContext();
  const calliopeConfig = useContext(CalliopeContext);

  let handleDroppedFile = (p: File) => console.log(p);

  if(calliopeConfig !== null) {
    const { config } = calliopeConfig;
    if(config.dragAndDropImage) {
      handleDroppedFile = config.dragAndDropImage.handleDroppedFile;
    }
  }

  useEffect(() => {
    return editor.registerCommand(
      DRAG_DROP_PASTE,
      (files) => {
        const filesIterator = files[Symbol.iterator]();
        // Batch all node insertions together to prevent asynchronous behavior causing unnecessary
        // DOM renders and redundant history entries
        const insertQueue: (() => void)[] = [];
        const handleNextFile = () => {
          const { value: file, done } = filesIterator.next();
          if (done) {
            for (let i = 0; i < insertQueue.length; i++) {
              insertQueue[i]();
            }
            return;
          }
          if (!handleDroppedFile) {
            const fileReader = new FileReader();
            fileReader.addEventListener('load', () => {
              const result = fileReader.result;
              if (typeof result === 'string' && isAcceptableImageType(file.type)) {
                insertQueue.push(() =>
                  editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
                    altText: file.name,
                    src: result,
                  })
                );
              }
              handleNextFile();
            });
            fileReader.readAsDataURL(file);
          } else {
            if (isAcceptableImageType(file.type)) {
              handleDroppedFile(file);
              handleNextFile();
            }
          }
        };
        handleNextFile();
        return true;
      },
      COMMAND_PRIORITY_LOW
    );
  }, [editor, handleDroppedFile]);
  return null;
}
