import type { Klass, LexicalNode } from 'lexical';
import { CalliopeConfigProps } from './CalliopeEditorTypes';
import { createContext } from 'react';

type CalliopeContextType = {
  config: CalliopeConfigProps;
  nodes: Klass<LexicalNode>[];
  plugins: JSX.Element;
  onEditorChange: (editorState: any) => {};
};

export const CalliopeContext = createContext<CalliopeContextType | null>(null);
