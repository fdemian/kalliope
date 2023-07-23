/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
// @ts-nocheck
import {useEffect, useRef, useState} from "react";
import Button from '../UI/Button';
import { DialogActions } from '../UI/Dialog';
import FileInput from '../UI/FileInput';
import Select from '../UI/Select';
import TextInput from '../UI/TextInput';
import {createPortal} from 'react-dom';

export function InsertInlineImageDialog({saveImage, onClose}: {
    saveImage: (payload:any) => void;
    onClose: () => void;
}): JSX.Element {
    const hasModifier = useRef(false);

    const [src, setSrc] = useState('');
    const [altText, setAltText] = useState('');
    const [showCaption, setShowCaption] = useState(false);
    const [position, setPosition] = useState('left');

    const isDisabled = src === '';

    const handleShowCaptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setShowCaption(e.target.checked);
    };

    const handlePositionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPosition(e.target.value);
    };

    const loadImage = (files: FileList | null) => {
        const reader = new FileReader();
        reader.onload = function () {
            if (typeof reader.result === 'string') {
                setSrc(reader.result);
            }
            return '';
        };
        if (files !== null) {
            reader.readAsDataURL(files[0]);
        }
    };

    useEffect(() => {
        hasModifier.current = false;
        const handler = (e: KeyboardEvent) => {
            hasModifier.current = e.altKey;
        };
        document.addEventListener('keydown', handler);
        return () => {
            document.removeEventListener('keydown', handler);
        };
    }, []);

    const handleOnClick = () => {
        const payload = {altText, position, showCaption, src};
        saveImage(payload);
        onClose();
    };

    return(
        <>
            <div style={{marginBottom: '1em'}}>
                <FileInput
                    label="Image Upload"
                    onChange={loadImage}
                    accept="image/*"
                    data-test-id="image-modal-file-upload"
                />
            </div>
            <div style={{marginBottom: '1em'}}>
                <TextInput
                    label="Alt Text"
                    placeholder="Descriptive alternative text"
                    onChange={setAltText}
                    value={altText}
                    data-test-id="image-modal-alt-text-input"
                />
            </div>

            <Select
                style={{marginBottom: '1em', width: '290px'}}
                label="Position"
                name="position"
                id="position-select"
                onChange={handlePositionChange}>
                <option value="left">Left</option>
                <option value="right">Right</option>
                <option value="full">Full Width</option>
            </Select>

            <div className="Input__wrapper">
                <input
                    id="caption"
                    type="checkbox"
                    checked={showCaption}
                    onChange={handleShowCaptionChange}
                />
                <label htmlFor="caption">Show Caption</label>
            </div>

            <DialogActions>
                <Button
                    data-test-id="image-modal-file-upload-btn"
                    disabled={isDisabled}
                    onClick={() => handleOnClick()}>
                    Confirm
                </Button>
            </DialogActions>
        </>
    );
}