/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {ReactElement,useCallback, useState} from 'react';
import KatexRenderer from './KatexRenderer';
import {LexicalErrorBoundary} from '@lexical/react/LexicalErrorBoundary';
import './KatexEquationAlterer.css';

type Props = {
  initialEquation?: string;
};

export default function KatexEquationAlterer({
  initialEquation = '',
}: Props): ReactElement {
  const [equation, setEquation] = useState<string>(initialEquation);
  const [inline, setInline] = useState<boolean>(true);
  const [editor] = useLexicalComposerContext();

  const onCheckboxChange = useCallback(() => {
    setInline(!inline);
  }, [setInline, inline]);

  return (
    <>
      <div className="KatexEquationAlterer_defaultRow">
        Inline
        <input type="checkbox" checked={inline} onChange={onCheckboxChange} />
      </div>
      <div className="KatexEquationAlterer_defaultRow">Equation </div>
      <div className="KatexEquationAlterer_centerRow">
        {inline ? (
          <input
            onChange={(event) => {
              setEquation(event.target.value);
            }}
            value={equation}
            className="KatexEquationAlterer_textArea"
          />
        ) : (
          <textarea
            onChange={(event) => {
              setEquation(event.target.value);
            }}
            value={equation}
            className="KatexEquationAlterer_textArea"
          />
        )}
      </div>
      <div className="KatexEquationAlterer_defaultRow">Visualization </div>
      <div className="KatexEquationAlterer_centerRow">
        <LexicalErrorBoundary onError={e => editor._onError(e)} fallback={null}>
          <KatexRenderer
            equation={equation}
            inline={false}
            onDoubleClick={() => null}
          />
        </LexicalErrorBoundary>
      </div>
    </>
  );
}
