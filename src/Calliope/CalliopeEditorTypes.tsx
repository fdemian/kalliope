import type { LexicalCommand, LexicalEditor } from 'lexical';

type DispatcherFn = () => {};
export type DispatcherType = (command: LexicalCommand<String | DispatcherFn>, payload?: any) => boolean;

export type EditorRefType = {
  focus: () => void;
  clear: () => void;
  dispatchCommand: DispatcherType;
};

type AvatarEntryComponent = {
  option: MentionItem;
}

type LoadingTweetProps = {
  tweetId: string;
}

type SourceCompProps = {
  sourceLink: string
};

type AuthorCompProps = {
  author: {
    link: string;
    name: string;
  }
};

export type DirectCommand = LexicalCommand<String | DispatcherFn>;
export type IndirectCommand = ((editor: LexicalEditor, _: any, _2: string) => void);

export type EditorCommand = {
  name: string;
  command: DirectCommand | IndirectCommand;
  directCommand: boolean;
};

export type EditorCommands = EditorCommand[];

export type MentionItem = {
  id: number;
  name: string;
  link: string;
  avatar?: string | null;
};

export type CalliopeConfigProps = {
  placeholderText: string;
  initialState: string | undefined;
  readOnly: boolean;
  autoFocus: boolean;
  onError: (error: any) => void;
  plugins: any;
  emojiConfig: {
    emojiData: any
  };
  twitterConfig: {
    loadingComponent: ({ tweetId }: LoadingTweetProps) => JSX.Element;
  };
  excalidrawConfig: {
    modal: () => JSX.Element;
  };
  citation: {
    sourceLinkComponent: ({ sourceLink }: SourceCompProps) => JSX.Element;
    authorComponent: ({ author }: AuthorCompProps) => JSX.Element;
  };
  imageConfig: {
    addCaptionText: string,
    defaultCaptionText: string
  };
  dragAndDropImage: {
    handleDroppedFile: (file: File) => void
  };
  mentions: {
    onSearchChange: (match: any) => void;
    onAddMention: (mention: MentionItem) => void;
    entryComponent: (entryProps: AvatarEntryComponent) => void;
    mentionsData: MentionItem[];
  };
};

type CalliopeContainerType = HTMLDivElement & {
  focus: () => void;
  clear: () => void;
  getContent: () => string;
  executeCommand: (name: string, props: any) => void;
};

export type CalliopeEditorProps = {
  config: CalliopeConfigProps;
  containerRef: React.MutableRefObject<CalliopeContainerType | null>;
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
