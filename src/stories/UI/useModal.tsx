/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {ReactElement, useCallback, useMemo, useState} from 'react';
import Modal from './Modal';

export default function useModal(): [
        ReactElement | null,
    (title: string, showModal: (onClose: () => void) => ReactElement) => void,
] {
    const [modalContent, setModalContent] = useState<null | {
        closeOnClickOutside: boolean;
        content: ReactElement;
        title: string;
    }>(null);

    const onClose = useCallback(() => {
        setModalContent(null);
    }, []);

    const modal = useMemo(() => {
        if (modalContent === null) {
            return null;
        }
        const {title, content, closeOnClickOutside} = modalContent;
        return (
            <Modal
                onClose={onClose}
                title={title}
                closeOnClickOutside={closeOnClickOutside}>
                {content}
            </Modal>
        );
    }, [modalContent, onClose]);

    const showModal = useCallback(
        (
            title: string,
             
            getContent: (onClose: () => void) => ReactElement,
            closeOnClickOutside = false,
        ) => {
            setModalContent({
                closeOnClickOutside,
                content: getContent(onClose),
                title,
            });
        },
        [onClose],
    );

    return [modal, showModal];
}