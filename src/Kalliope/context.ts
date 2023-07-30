import type { Klass, LexicalNode } from 'lexical';
import { CalliopeConfigProps } from './KalliopeEditorTypes';
import { createContext } from 'react';
import type { PluginComponentProps } from './Plugins/Plugins';

type CalliopeContextType = {
  config: CalliopeConfigProps;
  nodes: Klass<LexicalNode>[];
  plugins: (props: PluginComponentProps) => JSX.Element;
  onEditorChange: (editorState: any) => void;
  setFormats: (formats: any) => void;
  isSmallWidthViewport: boolean;
  internalFormat: any;
  setInternalFormat: (formats: any) => void;
};

export const CalliopeContext = createContext<CalliopeContextType | null>(null);
