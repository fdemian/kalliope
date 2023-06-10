import type { Klass, LexicalNode } from 'lexical';
import { CalliopeConfigProps } from './CalliopeEditorTypes';
import { createContext } from 'react';
import type { PluginComponentProps } from './Plugins/Plugins';

type CalliopeContextType = {
  config: CalliopeConfigProps;
  nodes: Klass<LexicalNode>[];
  plugins: (props: PluginComponentProps) => JSX.Element;
  onEditorChange: (editorState: any) => void;
};

export const CalliopeContext = createContext<CalliopeContextType | null>(null);
