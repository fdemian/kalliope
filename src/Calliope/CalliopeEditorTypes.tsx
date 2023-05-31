import type { LexicalCommand } from 'lexical';

type DispatcherFn = () => {};
export type DispatcherType = (command: LexicalCommand<String | DispatcherFn>, payload?: any) => boolean;

export type EditorRefType = {
  focus: () => void;
  clear: () => void;
  dispatchCommand: DispatcherType;
};

export type EntryProps = {
  avatar: string;
  name: string;
  link: string;
};

type SourceLinkTypes = {
  sourceLink: string;
};

export type EditorCommand = {
  name: string;
  command: LexicalCommand<String | DispatcherFn> | ((editor: LexicalEditor, _: any, family: string) => void);
  directCommand: boolean;
};

export type EditorCommands = EditorCommand[];

export type MentionItem = {
  id: number;
  name: string;
  link: string;
  avatar?: string | null;
};

type CalliopeConfigProps = {
  placeholderText: string;
  initialState: string | undefined;
  readOnly: boolean;
  autoFocus: boolean;
  onError: (error: any) => void;
  plugins: any;
  emojiConfig: any;
  citation: {
    sourceLinkComponent: React.VFC<SourceLinkTypes>;
  };
  mentions: {
    onSearchChange: (match: any) => void;
    onAddMention: (mention: MentionItem) => void;
    entryComponent: (entryProps: EntryProps) => void;
    mentionsData: MentionItem[];
  };
};

export type CalliopeEditorProps = {
  config: CalliopeConfigProps;
  containerRef: React.RefObject<HTMLDivElement>;
  setFormats: (formats: any) => void;
};

export type CalliopeFormatTypes = {
  blockType: string;
  selectedElementKey: string | null;
  isLink: boolean;
  isBold: boolean;
  isSpoiler: boolean;
  isKeyboard: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  isStrikethrough: boolean;
  isSubscript: boolean;
  isSuperscript: boolean;
  isCode: boolean;
  canUndo: boolean;
  canRedo: boolean;
  isRTL: boolean;
  codeLanguage: string;
  fontSize: string;
  fontColor: string;
  bgColor: string;
  fontFamily: string;
};
