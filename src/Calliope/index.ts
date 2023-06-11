import { getCodeLanguageOptions } from './utils/codeUtils';
import { CODE_LANGUAGE_MAP, getLanguageFriendlyName } from '@lexical/code';
import CalliopeEditor from './CalliopeEditor';

export default CalliopeEditor;
export {
  getCodeLanguageOptions as getCodeLanguageOptions,
  CODE_LANGUAGE_MAP as CODE_LANGUAGE_MAP,
  getLanguageFriendlyName as getLanguageFriendlyName,
};
