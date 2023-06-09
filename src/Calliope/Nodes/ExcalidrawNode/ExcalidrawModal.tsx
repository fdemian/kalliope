/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
// @ts-nocheck
import { Excalidraw } from '@excalidraw/excalidraw';
import {
  AppState,
  BinaryFiles,
  ExcalidrawImperativeAPI,
} from '@excalidraw/excalidraw/types/types';
import {ReactPortal, useEffect, useLayoutEffect, useRef, useState} from 'react';
import {createPortal} from 'react-dom';

export type ExcalidrawElementFragment = {
  isDeleted?: boolean;
};

type Props = {
  modalComponent: (props: ExcalidrawModalProps) => JSX.Element;
  closeOnClickOutside?: boolean;
  /**
   * The initial set of elements to draw into the scene
   */
  initialElements: ReadonlyArray<ExcalidrawElementFragment>;
  /**
   * The initial set of elements to draw into the scene
   */
  initialAppState: AppState;
  /**
   * The initial set of elements to draw into the scene
   */
  initialFiles: BinaryFiles;
  /**
   * Controls the visibility of the modal
   */
  isShown?: boolean;
  /**
   * Callback when closing and discarding the new changes
   */
  onClose: () => void;
  /**
   * Completely remove Excalidraw component
   */
  onDelete: () => void;
  /**
   * Callback when the save button is clicked
   */
  onSave: (
    elements: ReadonlyArray<ExcalidrawElementFragment>,
    appState: Partial<AppState>,
    files: BinaryFiles,
  ) => void;
};

/**
 * @explorer-desc
 * A component which renders a modal with Excalidraw (a painting app)
 * which can be used to export an editable image
 */
export default function ExcalidrawModal({
  modalComponent,
  closeOnClickOutside = false,
  onSave,
  initialElements,
  initialAppState,
  initialFiles,
  isShown = false,
  onDelete,
  onClose,
}: Props): ReactPortal | null {

  const ExternalExcalidrawModal = modalComponent;
  const excaliDrawModelRef = useRef<HTMLDivElement | null>(null);
  const excaliDrawSceneRef = useRef<ExcalidrawImperativeAPI>(null);
  const [elements, setElements] =
    useState<ReadonlyArray<ExcalidrawElementFragment>>(initialElements);
  const [files, setFiles] = useState<BinaryFiles>(initialFiles);

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
        !excaliDrawModelRef.current.contains(target as Node) &&
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

  useLayoutEffect(() => {
    const currentModalRef = excaliDrawModelRef.current;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onDelete();
      }
    };

    if (currentModalRef !== null) {
      currentModalRef.addEventListener('keydown', onKeyDown);
    }

    return () => {
      if (currentModalRef !== null) {
        currentModalRef.removeEventListener('keydown', onKeyDown);
      }
    };
  }, [elements, files, onDelete]);

  const save = () => {
    if (elements.filter((el) => !el.isDeleted).length > 0) {
      const appState = excaliDrawSceneRef?.current?.getAppState();
      if(appState === undefined || appState === null) {
        return({
            exportBackground: false,
            exportScale: false,
            exportWithDarkMode: false,
            isBindingEnabled: false,
            isLoading: true,
            name: false,
            theme: false,
            viewBackgroundColor: false,
            viewModeEnabled: false,
            zenModeEnabled: false,
            zoom: false,
         })
      }

      // We only need a subset of the state
      const partialState: Partial<AppState> = {
        exportBackground: appState.exportBackground,
        exportScale: appState.exportScale,
        exportWithDarkMode: appState.theme === 'dark',
        isBindingEnabled: appState.isBindingEnabled,
        isLoading: appState.isLoading,
        name: appState.name,
        theme: appState.theme,
        viewBackgroundColor: appState.viewBackgroundColor,
        viewModeEnabled: appState.viewModeEnabled,
        zenModeEnabled: appState.zenModeEnabled,
        zoom: appState.zoom,
      };
      onSave(elements, partialState, files);
    } else {
      // delete node if the scene is clear
      onDelete();
    }
  };

  const discard = () => {
    if (elements.filter((el) => !el.isDeleted).length === 0) {
      // Delete node if the scene is clear
      onDelete();
    } else {
      // Otherwise close the modal.
      onClose();
    }
  };

  if (isShown === false) {
    return null;
  }

  const onChange = (
    els: ReadonlyArray<ExcalidrawElementFragment>,
    _: AppState,
    fls: BinaryFiles,
  ) => {
    setElements(els);
    setFiles(fls);
  };

  // This is a hacky work-around for Excalidraw + Vite.
  // In DEV, Vite pulls this in fine, in prod it doesn't. It seems
  // like a module resolution issue with ESM vs CJS?
  const excalidrawComponent =
    Excalidraw.$$typeof != null ? Excalidraw : Excalidraw.default;

  return (
  <ExternalExcalidrawModal
    excaliDrawSceneRef={excaliDrawSceneRef}
    excalidrawComponent={excalidrawComponent}
    discard={discard}
    save={save}
    onDelete={onDelete}
    onChange={onChange}
    closeOnClickOutside={closeOnClickOutside}
    initialElements={initialElements}
    initialAppState={initialAppState}
    initialFiles={initialFiles}
    isShown={isShown}
  />
  );
}
