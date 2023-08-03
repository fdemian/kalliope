import type { Klass, LexicalNode } from 'lexical';
import {CalliopeConfigProps, CalliopeFormatTypes} from './KalliopeEditorTypes';
import { createContext } from 'react';
import type { PluginComponentProps } from './Plugins/Plugins';
import type {EditorState} from "lexical";

export type CalliopeContextType = {
  config: CalliopeConfigProps;
  nodes: Klass<LexicalNode>[];
  plugins: (props: PluginComponentProps) => JSX.Element;
  onEditorChange: (editorState: EditorState) => void;
  setFormats: (formats: CalliopeFormatTypes) => void;
  setCanUndo: (payload: boolean) => void;
  setCanRedo: (payload: boolean) => void;
  isSmallWidthViewport: boolean;
  internalFormat: CalliopeFormatTypes;
  setInternalFormat: (formats: CalliopeFormatTypes) => void;
};

export const CalliopeContext = createContext<CalliopeContextType | null>(null);
