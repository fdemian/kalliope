/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import type {Ref, RefObject} from 'react';
import {ChangeEvent} from 'react';
import './EquationEditor.css';

type BaseEquationEditorProps = {
  equation: string;
  inline: boolean;
  setEquation: (equation: string) => void;
  inputRef: Ref<HTMLInputElement | HTMLTextAreaElement>;
};

const EquationEditor = (
    {equation, setEquation, inline, inputRef}: BaseEquationEditorProps,
): JSX.Element => {

  const onChange = (event: ChangeEvent) => setEquation((event.target as HTMLInputElement).value);

  return inline && inputRef instanceof HTMLInputElement ? (
    <span className="EquationEditor_inputBackground">
      <span className="EquationEditor_dollarSign">$</span>
      <input
        className="EquationEditor_inlineEditor"
        value={equation}
        onChange={onChange}
        autoFocus={true}
        ref={inputRef as RefObject<HTMLInputElement>}
      />
      <span className="EquationEditor_dollarSign">$</span>
    </span>
  ) : (
    <div className="EquationEditor_inputBackground">
      <span className="EquationEditor_dollarSign">{'$$\n'}</span>
      <textarea
        className="EquationEditor_blockEditor"
        value={equation}
        onChange={onChange}
        ref={inputRef as RefObject<HTMLTextAreaElement>}
      />
      <span className="EquationEditor_dollarSign">{'\n$$'}</span>
    </div>
  );
}

export default EquationEditor;
