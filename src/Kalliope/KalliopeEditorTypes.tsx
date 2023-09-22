import type { NodeKey, LexicalCommand, LexicalEditor } from 'lexical';
import {
  AppState,
  BinaryFiles,
  ExcalidrawImperativeAPI,
} from '@excalidraw/excalidraw/types/types';
import { ReactElement } from "react";

type DispatcherFn = () => void;

type AvatarEntryComponent = {
  option: MentionItem;
}

type LoadingTweetProps = {
  tweetId: string;
}

type SourceCompProps = {
  sourceLink: string;
};

type ExcalidrawElementFragment = {
  isDeleted?: boolean;
};

export type ExcalidrawModalProps = {
  excalidrawComponent: JSX.Element;
  excaliDrawSceneRef: ExcalidrawImperativeAPI;
  discard: () => void;
  save: () => void;
  onChange: () => void;
  closeOnClickOutside?: boolean;
  /**
   * The initial set of elements to draw into the scene
   */
  initialElements: ReadonlyArray<ExcalidrawElementFragment>;
  /**
   * The initial set of elements to draw into the scene
   */
  initialAppState: AppState;
  /**
   * The initial set of elements to draw into the scene
   */
  initialFiles: BinaryFiles;
  /**
   * Controls the visibility of the modal
   */
  isShown?: boolean;
  /**
   * Callback when closing and discarding the new changes
   */
  onClose: () => void;
  /**
   * Completely remove Excalidraw component
   */
  onDelete: () => void;
  /**
   * Callback when the save button is clicked
   */
  onSave: (
    elements: ReadonlyArray<ExcalidrawElementFragment>,
    appState: Partial<AppState>,
    files: BinaryFiles,
  ) => void;
};

type AuthorCompProps = {
  author: {
    link: string;
    name: string;
  }
};

type LexicalEditorRef = {
  current: LexicalEditor;
};

export type DirectCommand = LexicalCommand<string | DispatcherFn>;
export type IndirectCommand = ((editor: LexicalEditorRef, _: any, _2: string) => void);

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
  avatar?: string | null;
};

export type ShowModalProps = {
  activeEditor: LexicalEditor;
  nodeKey: NodeKey;
};

export type CalliopeConfigProps = {
  placeholderText: string;
  initialState: string | undefined;
  readOnly: boolean;
  autoFocus: boolean;
  onError: (error: Error) => void;
  plugins: string[];
  emojiConfig: {
    emojiData: any
  };
  twitterConfig: {
    loadingComponent: ({ tweetId }: LoadingTweetProps) => JSX.Element;
  };
  excalidrawConfig: {
    modal: (props: ExcalidrawModalProps) => ReactElement;
  };
  citation: {
    sourceLinkComponent: ({ sourceLink }: SourceCompProps) => JSX.Element;
    authorComponent: ({ author }: AuthorCompProps) => JSX.Element;
  };
  imageConfig: {
    addCaptionText: string,
    defaultCaptionText: string
  };
  inlineImage: {
    showModal: (showModalProps: ShowModalProps) => void;
  };
  dragAndDropImage: {
    handleDroppedFile: (file: File) => void
  };
  mentions: {
    onSearchChange: (match: string) => void;
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
  setFormats: (formats: CalliopeFormatTypes) => void;
  setCanUndo: (payload: boolean) => void;
  setCanRedo: (payload: boolean) => void;
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
