/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {CodePrismExtension} from '@lexical/code-prism';
import {CodeShikiExtension} from '@lexical/code-shiki';
import {
  effect,
  getExtensionDependencyFromEditor,
  namedSignals,
} from '@lexical/extension';
import {configExtension, defineExtension, safeCast} from 'lexical';
import type { LexicalEditor } from "lexical";

export type CodeHighlightMode = 'off' | 'prism' | 'shiki';

export interface CodeHighlightConfig {
  mode: CodeHighlightMode;
}

/**
 * Playground aggregator that switches between {@link CodePrismExtension}
 * and {@link CodeShikiExtension} based on a `mode` signal. Both sub-
 * extensions start in `disabled: true` state and this extension flips
 * their `disabled` signals to route highlighting to the selected engine.
 */
export const CodeHighlightExtension = defineExtension({
  // @ts-ignore
  build: (editor:LexicalEditor, config:CodeHighlightConfig) => namedSignals(config),
  config: safeCast<CodeHighlightConfig>({mode: 'off'}),
  dependencies: [
    configExtension(CodePrismExtension, {disabled: true}),
    configExtension(CodeShikiExtension, {disabled: true}),
  ],
  name: '@lexical/playground/CodeHighlight',
  // @ts-ignore
  register: (editor:LexicalEditor, config:CodeHighlightConfig, state) => {
    const prismOutput = getExtensionDependencyFromEditor(
      editor,
      CodePrismExtension,
    ).output;
    const shikiOutput = getExtensionDependencyFromEditor(
      editor,
      CodeShikiExtension,
    ).output;
    return effect(() => {
      const mode = state.getOutput().mode.value;
      prismOutput.disabled.value = mode !== 'prism';
      shikiOutput.disabled.value = mode !== 'shiki';
    });
  },
});
