import type { Klass, LexicalNode } from 'lexical';
import { CalliopeConfigProps } from './KalliopeEditorTypes';
import { createContext } from 'react';
import type { PluginComponentProps } from './Plugins/Plugins';
import {EditorRefType} from "./KalliopeEditorTypes";

type CalliopeContextType = {
  config: CalliopeConfigProps;
  nodes: Klass<LexicalNode>[];
  plugins: (props: PluginComponentProps) => JSX.Element;
  onEditorChange: (editorState: any) => void;
  setFormats: (formats: any) => void;
  isSmallWidthViewport: boolean;
  internalFormat: any;
  setInternalFormat: (formats: any) => void;
  setEditorRef: (any) => void;
  editorRef: EditorRefType;
  floatingAnchorElem: HTMLDivElement | null;
};

export const CalliopeContext = createContext<CalliopeContextType | null>(null);
