/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
// @ts-nocheck
import './ExcalidrawModal.css';
import {createPortal} from 'react-dom';
import {
  ReactElement,
  useEffect,
  useRef,
} from 'react';
import {isDOMNode} from 'lexical';
import { ExcalidrawModalProps } from '../../Kalliope/KalliopeEditorTypes';
import type {JSX} from 'react';

type ExcalidrawModalType = (props: ExcalidrawModalProps) => ReactElement;

const ExcalidrawModal:ExcalidrawModalType = (props: ExcalidrawModalProps) => {
  const {
    excalidrawComponent,
    setExcalidrawAPI,
    discard,
    save,
    onDelete,
    onChange,
    closeOnClickOutside = false,
    initialElements,
    initialAppState,
    initialFiles
  } = props;

  const excaliDrawModelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (excaliDrawModelRef.current !== null) {
      excaliDrawModelRef.current.focus();
    }
  }, []);

  useEffect(() => {
    let modalOverlayElement: HTMLElement | null = null;

    const clickOutsideHandler = (event: MouseEvent) => {
    const target = event.target;
    if (
      excaliDrawModelRef.current !== null &&
      isDOMNode(target) &&
      !excaliDrawModelRef.current.contains(target) &&
      closeOnClickOutside
    ) {
      onDelete();
    }
   };

   if (excaliDrawModelRef.current !== null) {
     modalOverlayElement = excaliDrawModelRef.current?.parentElement;
     if (modalOverlayElement !== null) {
       modalOverlayElement?.addEventListener('click', clickOutsideHandler);
     }
   }

   return () => {
     if (modalOverlayElement !== null) {
      modalOverlayElement?.removeEventListener('click', clickOutsideHandler);
     }
    };
   }, [closeOnClickOutside, onDelete]);

  const Excalidraw = excalidrawComponent;
  
  return createPortal(
  <div
    className="ExcalidrawModal__overlay"
    role="dialog"
  >
    <div
      className="ExcalidrawModal__modal"
      ref={excaliDrawModelRef}
      tabIndex={-1}
    >
      <div className="ExcalidrawModal__row">
        <Excalidraw
          onChange={onChange}
          excalidrawAPI={(api) => setExcalidrawAPI(api)}
          initialData={{
            appState: initialAppState || {isLoading: false},
            elements: initialElements,
            files: initialFiles,
          }}
        />
        <div className="ExcalidrawModal__actions">
          <button
            className="action-button"
            onClick={discard}
          >
            Discard
          </button>
          <button
            className="action-button"
            onClick={save}
          >
           Save
          </button>
        </div>
      </div>
    </div>
  </div>,
  document.body,
  );
}

export default ExcalidrawModal;
