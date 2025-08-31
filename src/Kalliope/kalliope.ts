import { getCodeLanguageOptions, normalizePrism, normalizeShiki, CODE_THEME_OPTIONS_SHIKI } from './utils/codeUtils';
import { $getNodeByKey } from "lexical";
import Kalliope from './KalliopeEditor';
import type { CalliopeEditorProps, CalliopeContainerType } from './KalliopeEditorTypes';
import {ReactElement } from 'react';

export {
  getCodeLanguageOptions,
  normalizePrism, 
  normalizeShiki,
  CODE_THEME_OPTIONS_SHIKI,
  $getNodeByKey,
  CalliopeContainerType
};

export default Kalliope as (props:CalliopeEditorProps) => ReactElement;
