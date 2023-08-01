import { useRef, useState } from 'react';
import type { Meta } from '@storybook/react';
import { CalliopeFormatTypes, MentionItem } from '../Kalliope/KalliopeEditorTypes';
import Editor, { getCodeLanguageOptions } from '../Kalliope/index';
import { SketchPicker } from 'react-color';
import {initialMentions} from './mentionsData';
import URLToolbar from './URLToolbar';
import { InsertInlineImageDialog } from './InlineImageModal/InlineImageUI';
import { UpdateInlineImageDialog } from "./InlineImageModal/InsertImageModal";
import ExcalidrawModal from './ExcalidrawModal/ExcalidrawModal';
import useModal from './UI/useModal';
import type { MouseEventHandler } from 'react';

//const INITIAL_STATE = '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Normal text.","type":"text","version":1},{"detail":0,"format":1,"mode":"normal","style":"","text":" Bold text","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":" .","type":"text","version":1},{"detail":0,"format":2,"mode":"normal","style":"","text":" Italic text. ","type":"text","version":1},{"detail":0,"format":8,"mode":"normal","style":"","text":"Underlined text","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":" . ","type":"text","version":1},{"detail":0,"format":4,"mode":"normal","style":"","text":"Strikethrough text","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":" . Superscripttext Subscripttext . ","type":"text","version":1},{"detail":0,"format":16,"mode":"normal","style":"","text":"code()","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":" some of this text will be hidden in spoilers.. ctrl + v.","type":"text","version":1}],"direction":"ltr","format":"left","indent":0,"type":"paragraph","version":1},{"type":"horizontalrule","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"The text above is separated by a rule element.","type":"text","version":1}],"direction":"ltr","format":"left","indent":0,"type":"paragraph","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"This text is colored ","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"color: #417505;","text":"green","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":". ","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"background-color: #cd0d0d;","text":"This text has a red background","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":".","type":"text","version":1}],"direction":"ltr","format":"left","indent":0,"type":"paragraph","version":1},{"type":"horizontalrule","version":1},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"This is a link.","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"link","version":1,"rel":null,"target":null,"title":null,"url":"https://www.google.com/"}],"direction":"ltr","format":"start","indent":0,"type":"paragraph","version":1},{"type":"horizontalrule","version":1},{"children":[],"direction":"ltr","format":"start","indent":0,"type":"paragraph","version":1},{"children":[{"altText":"","caption":{"editorState":{"root":{"children":[],"direction":null,"format":"","indent":0,"type":"root","version":1}}},"height":0,"maxWidth":500,"showCaption":false,"src":"https://upload.wikimedia.org/wikipedia/commons/5/55/Romeo_and_juliet_brown.jpg","width":0,"type":"image","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1},{"children":[],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":" ","type":"text","version":1},{"detail":0,"format":2,"mode":"normal","style":"","text":"f","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":"(","type":"text","version":1},{"detail":0,"format":2,"mode":"normal","style":"","text":"x","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":")=2 is certainly a function.","type":"text","version":1}],"direction":"ltr","format":"left","indent":0,"type":"paragraph","version":1},{"children":[{"children":[{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"MONDAY","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"tablecell","version":1,"colSpan":1,"rowSpan":1,"backgroundColor":null,"headerState":3},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"TUESDAY","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"tablecell","version":1,"colSpan":1,"rowSpan":1,"backgroundColor":null,"headerState":1},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"WEDNESDAY","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"tablecell","version":1,"colSpan":1,"rowSpan":1,"backgroundColor":null,"headerState":1},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"THURSDAY","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"tablecell","version":1,"colSpan":1,"rowSpan":1,"backgroundColor":null,"headerState":1},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"FRIDAY","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"tablecell","version":1,"colSpan":1,"rowSpan":1,"backgroundColor":null,"headerState":1},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"SATURDAY","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"tablecell","version":1,"colSpan":1,"rowSpan":1,"backgroundColor":null,"headerState":1},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"SUNDAY","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"tablecell","version":1,"colSpan":1,"rowSpan":1,"backgroundColor":null,"headerState":1}],"direction":"ltr","format":"","indent":0,"type":"tablerow","version":1},{"children":[{"children":[{"children":[],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"tablecell","version":1,"colSpan":1,"rowSpan":1,"backgroundColor":null,"headerState":2},{"children":[{"children":[],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"tablecell","version":1,"colSpan":1,"rowSpan":1,"backgroundColor":null,"headerState":0},{"children":[{"children":[],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"tablecell","version":1,"colSpan":1,"rowSpan":1,"backgroundColor":null,"headerState":0},{"children":[{"children":[],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"tablecell","version":1,"colSpan":1,"rowSpan":1,"backgroundColor":null,"headerState":0},{"children":[{"children":[],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"tablecell","version":1,"colSpan":1,"rowSpan":1,"backgroundColor":null,"headerState":0},{"children":[{"children":[],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"tablecell","version":1,"colSpan":1,"rowSpan":1,"backgroundColor":null,"headerState":0},{"children":[{"children":[],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"tablecell","version":1,"colSpan":1,"rowSpan":1,"backgroundColor":null,"headerState":0}],"direction":"ltr","format":"","indent":0,"type":"tablerow","version":1},{"children":[{"children":[{"children":[],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"tablecell","version":1,"colSpan":1,"rowSpan":1,"backgroundColor":null,"headerState":2},{"children":[{"children":[],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"tablecell","version":1,"colSpan":1,"rowSpan":1,"backgroundColor":null,"headerState":0},{"children":[{"children":[],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"tablecell","version":1,"colSpan":1,"rowSpan":1,"backgroundColor":null,"headerState":0},{"children":[{"children":[],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"tablecell","version":1,"colSpan":1,"rowSpan":1,"backgroundColor":null,"headerState":0},{"children":[{"children":[],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"tablecell","version":1,"colSpan":1,"rowSpan":1,"backgroundColor":null,"headerState":0},{"children":[{"children":[],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"tablecell","version":1,"colSpan":1,"rowSpan":1,"backgroundColor":null,"headerState":0},{"children":[{"children":[],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"tablecell","version":1,"colSpan":1,"rowSpan":1,"backgroundColor":null,"headerState":0}],"direction":"ltr","format":"","indent":0,"type":"tablerow","version":1},{"children":[{"children":[{"children":[],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"tablecell","version":1,"colSpan":1,"rowSpan":1,"backgroundColor":null,"headerState":2},{"children":[{"children":[],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"tablecell","version":1,"colSpan":1,"rowSpan":1,"backgroundColor":null,"headerState":0},{"children":[{"children":[],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"tablecell","version":1,"colSpan":1,"rowSpan":1,"backgroundColor":null,"headerState":0},{"children":[{"children":[],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"tablecell","version":1,"colSpan":1,"rowSpan":1,"backgroundColor":null,"headerState":0},{"children":[{"children":[],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"tablecell","version":1,"colSpan":1,"rowSpan":1,"backgroundColor":null,"headerState":0},{"children":[{"children":[],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"tablecell","version":1,"colSpan":1,"rowSpan":1,"backgroundColor":null,"headerState":0},{"children":[{"children":[],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"tablecell","version":1,"colSpan":1,"rowSpan":1,"backgroundColor":null,"headerState":0}],"direction":"ltr","format":"","indent":0,"type":"tablerow","version":1},{"children":[{"children":[{"children":[],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"tablecell","version":1,"colSpan":1,"rowSpan":1,"backgroundColor":null,"headerState":2},{"children":[{"children":[],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"tablecell","version":1,"colSpan":1,"rowSpan":1,"backgroundColor":null,"headerState":0},{"children":[{"children":[],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"tablecell","version":1,"colSpan":1,"rowSpan":1,"backgroundColor":null,"headerState":0},{"children":[{"children":[],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"tablecell","version":1,"colSpan":1,"rowSpan":1,"backgroundColor":null,"headerState":0},{"children":[{"children":[],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"tablecell","version":1,"colSpan":1,"rowSpan":1,"backgroundColor":null,"headerState":0},{"children":[{"children":[],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"tablecell","version":1,"colSpan":1,"rowSpan":1,"backgroundColor":null,"headerState":0},{"children":[{"children":[],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"tablecell","version":1,"colSpan":1,"rowSpan":1,"backgroundColor":null,"headerState":0}],"direction":"ltr","format":"","indent":0,"type":"tablerow","version":1},{"children":[{"children":[{"children":[],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"tablecell","version":1,"colSpan":1,"rowSpan":1,"backgroundColor":null,"headerState":2},{"children":[{"children":[],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"tablecell","version":1,"colSpan":1,"rowSpan":1,"backgroundColor":null,"headerState":0},{"children":[{"children":[],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"tablecell","version":1,"colSpan":1,"rowSpan":1,"backgroundColor":null,"headerState":0},{"children":[{"children":[],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"tablecell","version":1,"colSpan":1,"rowSpan":1,"backgroundColor":null,"headerState":0},{"children":[{"children":[],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"tablecell","version":1,"colSpan":1,"rowSpan":1,"backgroundColor":null,"headerState":0},{"children":[{"children":[],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"tablecell","version":1,"colSpan":1,"rowSpan":1,"backgroundColor":null,"headerState":0},{"children":[{"children":[],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"tablecell","version":1,"colSpan":1,"rowSpan":1,"backgroundColor":null,"headerState":0}],"direction":"ltr","format":"","indent":0,"type":"tablerow","version":1},{"children":[{"children":[{"children":[],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"tablecell","version":1,"colSpan":1,"rowSpan":1,"backgroundColor":null,"headerState":2},{"children":[{"children":[],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"tablecell","version":1,"colSpan":1,"rowSpan":1,"backgroundColor":null,"headerState":0},{"children":[{"children":[],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"tablecell","version":1,"colSpan":1,"rowSpan":1,"backgroundColor":null,"headerState":0},{"children":[{"children":[],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"tablecell","version":1,"colSpan":1,"rowSpan":1,"backgroundColor":null,"headerState":0},{"children":[{"children":[],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"tablecell","version":1,"colSpan":1,"rowSpan":1,"backgroundColor":null,"headerState":0},{"children":[{"children":[],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"tablecell","version":1,"colSpan":1,"rowSpan":1,"backgroundColor":null,"headerState":0},{"children":[{"children":[],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"tablecell","version":1,"colSpan":1,"rowSpan":1,"backgroundColor":null,"headerState":0}],"direction":"ltr","format":"","indent":0,"type":"tablerow","version":1}],"direction":"ltr","format":"","indent":0,"type":"table","version":1},{"children":[],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1},{"format":"","type":"cite-node","version":1,"authorName":"Shakespeare","authorLink":"https://en.wikipedia.org/wiki/William_Shakespeare","authorAvatar":"","sourceContent":{"editorState":{"root":{"children":[],"direction":null,"format":"","indent":0,"type":"root","version":1}}},"sourceLink":"https://en.wikipedia.org/wiki/Romeo_and_Juliet"},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"SPOILERS FOR THE WHOLE MOVIE!!","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"collapsible-title","version":1},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"The hero dies","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"collapsible-content","version":1}],"direction":"ltr","format":"","indent":0,"type":"collapsible-container","version":1,"open":false},{"children":[],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1},{"children":[{"videoURL":"https://www.youtube.com/watch?v=z9AmHckdDWI","type":"video","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1},{"children":[],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1},{"children":[],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1},{"children":[{"data":"{\\"appState\\":{\\"exportBackground\\":true,\\"exportScale\\":2,\\"exportWithDarkMode\\":false,\\"isBindingEnabled\\":true,\\"isLoading\\":false,\\"name\\":\\"Untitled-2023-07-30-2029\\",\\"theme\\":\\"light\\",\\"viewBackgroundColor\\":\\"#ffffff\\",\\"viewModeEnabled\\":false,\\"zenModeEnabled\\":false,\\"zoom\\":{\\"value\\":1}},\\"elements\\":[{\\"id\\":\\"AR1TR_FhiLDCy8hu0u9Kr\\",\\"type\\":\\"rectangle\\",\\"x\\":383.6328125,\\"y\\":185.87109375,\\"width\\":173.9375,\\"height\\":153.4375,\\"angle\\":0,\\"strokeColor\\":\\"#000000\\",\\"backgroundColor\\":\\"transparent\\",\\"fillStyle\\":\\"hachure\\",\\"strokeWidth\\":1,\\"strokeStyle\\":\\"solid\\",\\"roughness\\":1,\\"opacity\\":100,\\"groupIds\\":[],\\"roundness\\":{\\"type\\":3},\\"seed\\":1172422051,\\"version\\":24,\\"versionNonce\\":639476781,\\"isDeleted\\":false,\\"boundElements\\":null,\\"updated\\":1690759801306,\\"link\\":null,\\"locked\\":false}],\\"files\\":{}}","type":"excalidraw","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}';

const QUOTE_STATE = "{\"root\":{\"children\":[{\"children\":[{\"detail\":0,\"format\":2,\"mode\":\"normal\",\"style\":\"color: rgb(24, 24, 24);background-color: rgb(255, 255, 255);\",\"text\":\"These violent delights have violent ends\",\"type\":\"text\",\"version\":1},{\"type\":\"linebreak\",\"version\":1},{\"detail\":0,\"format\":2,\"mode\":\"normal\",\"style\":\"color: rgb(24, 24, 24);background-color: rgb(255, 255, 255);\",\"text\":\"And in their triump die, like fire and powder\",\"type\":\"text\",\"version\":1},{\"type\":\"linebreak\",\"version\":1},{\"detail\":0,\"format\":2,\"mode\":\"normal\",\"style\":\"color: rgb(24, 24, 24);background-color: rgb(255, 255, 255);\",\"text\":\"Which, as they kiss, consume\",\"type\":\"text\",\"version\":1}],\"direction\":\"ltr\",\"format\":\"\",\"indent\":0,\"type\":\"paragraph\",\"version\":1}],\"direction\":\"ltr\",\"format\":\"\",\"indent\":0,\"type\":\"root\",\"version\":1}}";
type CalliopeContainerType = HTMLDivElement & {
  focus: () => void;
  clear: () => void;
  getContent: () => string;
  executeCommand: (name: string, props: any) => void;
};

type SourceLinkProps = {
  sourceLink: string;
}

type LoadingTweetProps = {
  tweetId: string;
}

type AvatarEntryComponent = {
  option: MentionItem;
}

const initialFormatTypes = {
  blockType: 'normal',
  selectedElementKey: null,
  isLink: false,
  isBold: false,
  isSpoiler: false,
  isKeyboard: false,
  isItalic: false,
  isUnderline: false,
  isStrikethrough: false,
  isSubscript: false,
  isSuperscript: false,
  isCode: false,
  canUndo: false,
  canRedo: false,
  isRTL: false,
  codeLanguage: '',
  fontSize: '',
  fontColor: '',
  bgColor: '',
  fontFamily: ''
};

type AuthorCompProps = {
  author: {
    link: string;
    name: string;
  }
};

export const EditorComposer = () => {
  const containerRef = useRef<null | CalliopeContainerType>(null);
  const [editorState, setEditorState] = useState<string | null>(null);
  const [formats, setFormats] = useState<CalliopeFormatTypes>(initialFormatTypes);
  const [suggestions, setSuggestions] = useState(initialMentions);
  const [isSpeechToText, setIsSpeechToText] = useState<boolean | null>(false);

  // TOOLBARS
  const [isTweetToolbar, setTweetToolbar] = useState<boolean | null>(false);
  const [isVideoToolbar, setVideoToolbar] = useState<boolean | null>(false);
  const [isImageToolbar, setImageToolbar] = useState<boolean | null>(false);
  const [url, setUrl] = useState<string | null>(null);

  const [inlineImageModal, showModal] = useModal();

  const toggleTweetToolbar = () => setTweetToolbar(false);
  const toggleVideoToolbar = () => setVideoToolbar(false);
  const toggleImageToolbar = () => setImageToolbar(false);

  const onSearchChange = (match: string) => {
    if(match) {
      const newSuggestions = initialMentions.filter(p => p.name.includes(match));
      setSuggestions(newSuggestions);
    }
  }

  const blockFormatChangeFn = (val: string) => {
    if(!containerRef.current)
      return;
    containerRef.current.executeCommand(val, null);
  }

  const codeLanguageChange = (val: string) => {
    if(!containerRef.current)
      return;
    containerRef.current.executeCommand("CODE_LANGUAGE_CHANGE", val);
  }

  const fontFamilyChangeFn = (val: string) => {
    if(!containerRef.current)
      return;
    containerRef.current.executeCommand("CHANGE_FONT", val);
  }

  const fontSizeChange = (val: string) => {
    if(!containerRef.current)
      return;
    containerRef.current.executeCommand("CHANGE_FONT_SIZE", val);
  }

  const fontColorSelect = (val: { hex: string}) => {
    if(!containerRef.current)
      return;
    containerRef.current.executeCommand("CHANGE_FONT_COLOR", val.hex);
  }

  const bgColorSelect = (val: { hex: string}) => {
    if(!containerRef.current)
      return;
    containerRef.current.executeCommand("CHANGE_FONT_BG_COLOR", val.hex);
  }

  const insertTweet = () => {
    if(!containerRef.current || url === null || url === undefined)
      return;
    const tweetId = url?.split('status/')?.[1]?.split('?')?.[0];
    containerRef.current.executeCommand("INSERT_TWEET", tweetId);
    setUrl(null);
    setTweetToolbar(false);
  }

  const insertImage = () => {
    if(!containerRef.current)
      return;
    const props = {
      altText: "",
      src: url
    };
    containerRef.current.executeCommand("INSERT_IMAGE", props);
    setUrl(null);
    setImageToolbar(false);
  }

  const insertInlineImage = (image) => {
    if(!containerRef.current)
      return;
    containerRef.current.executeCommand("INSERT_IMAGE_INLINE", image);
  }

  const insertVideo = () => {
    if(!containerRef.current || url === null)
      return;
    containerRef.current.executeCommand("INSERT_VIDEO", url);
    setUrl(null);
    setVideoToolbar(false);
  }

  const insertTable = () => {
    const columns = 7;
    const rows = 7;
    if(!containerRef.current)
      return;
    containerRef.current.executeCommand("INSERT_TABLE", {columns, rows});
  }

  const config = {
    placeholderText: 'Insert text...',
    initialState: undefined,
    readOnly: false,
    autoFocus: false,
    onError: (error: Error) => {
      throw error;
    },
    plugins:[],
    imageConfig: {
      addCaptionText: "Add caption",
      defaultCaptionText: "Enter image caption..."
    },
    inlineImage: {
      showModal: (modalProps) => showModal('Update inline image', (onClose) => (
          <UpdateInlineImageDialog {...modalProps} onClose={onClose} />
      ))
    },
    excalidrawConfig: {
      modal: ExcalidrawModal
    },
    twitterConfig: {
      loadingComponent: ({ tweetId }: LoadingTweetProps) => (
      <p>
        Loading tweet...(ID={tweetId})
      </p>
      )
    },
    collapsibleConfig: {
      open: true
    },
    dragAndDropImage: {
      handleDroppedFile: (file: File) => {
        console.log("Dropped file");
        console.log(file);
      }
    },
    citation: {
      sourceLinkComponent: ({ sourceLink }: SourceLinkProps) => (
      <>
        <a href={sourceLink}>[source]</a>
      </>
      ),
      authorComponent: ({ author }: AuthorCompProps) => (
        <a href={author.link}>{author.name}</a>
      )
    },
    emojiConfig: {
      emojiData: null
    },
    mentions: {
      onSearchChange,
      onAddMention: (mention: MentionItem) => {
        console.clear();
        console.log(mention);
      },
      onRemoveMention: (mentionName: string) => {
        console.clear();
        console.log(mentionName);
      },
      entryComponent: ({option: { name }}: AvatarEntryComponent) => (
       <>
        <img
          src="https://testing-library.com/img/octopus-64x64.png"
          width="20"
          height="20"
          alt="User avatar placeholder"
          />
          &nbsp; &nbsp; <strong>{name}</strong>
       </>
      ),
      mentionsData: suggestions
    }
  };

  // UI props
  const BUTTON_ELEMENTS = [
    {
      text: "BOLD",
      command: "FORMAT",
      props: "bold",
      isActive: formats.isBold
    },
    {
      text: "ITALIC",
      command: "FORMAT",
      props: "italic",
      isActive: formats.isItalic
    },
    {
      text: "UNDERLINE",
      command: "FORMAT",
      props: "underline",
      isActive: formats.isUnderline
    },
    {
      text: "STRIKETHROUGH",
      command: "FORMAT",
      props: "strikethrough",
      isActive: formats.isStrikethrough
    },
    {
      text: "SUPERSCRIPT",
      command: "FORMAT",
      props: "superscript",
      isActive: formats.isSuperscript
    },
    {
      text: "SUBSCRIPT",
      command: "FORMAT",
      props: "subscript",
      isActive: formats.isSubscript
    },
    {
      text: "CODE",
      command: "FORMAT",
      props: "code",
      isActive: formats.isCode
    },
    {
      text: "SPOILER",
      command: "SPOILER",
      props: null,
      isActive: formats.isSpoiler
    },
    {
      text: "KEYBOARD",
      command: "KEYBOARD",
      props: null,
      isActive: formats.isKeyboard
    },
    {
      text: "LINK",
      command: "LINK",
      props: formats.isLink ? null: "https://",
      isActive: formats.isLink
    },
    {
       /* left, center, right justify */
       text: "ALIGN LEFT",
       command: "ALIGN",
       props: "left",
       directCommand: true
     },
     {
        text: "ALIGN RIGHT",
        command: "ALIGN",
        props: "right",
        directCommand: true
      },
      {
         text: "ALIGN CENTER",
         command: "ALIGN",
         props: "center",
         directCommand: true
       },
       {
          text: "JUSTIFY",
          command: "ALIGN",
          props: "justify",
          directCommand: true
      },
      {
        text: "INDENT",
        command: "INDENT",
        props: null,
        directCommand: true
      },
      {
        text: "OUTDENT",
        command: "OUTDENT",
        props: null,
        directCommand: true
      }
  ];

  const blockFormatMap: {[index: string]:any} = {
    h1: "H1",
    h2: "H2",
    h3: "H3",
    paragraph: "PARAGRAPH",
    bullet: "BULLET_LIST",
    number: "NUMBERED_LIST",
    check: "CHECK",
    quote: "QUOTE",
    code: "CODE_BLOCK"
  };

  const BLOCK_FORMATS = [
    {
      name: "Normal",
      value: "PARAGRAPH"
    },
    {
      name: "Heading 1",
      value: "H1"
    },
    {
      name: "Heading 2",
      value: "H2"
    },
    {
      name: "Heading 3",
      value: "H3"
    },
    {
      name: "Bullet List",
      value: "BULLET_LIST"
    },
    {
      name: "Numbered List",
      value: "NUMBERED_LIST"
    },
    {
      name: "Check List",
      value: "CHECK"
    },
    {
      name: "Quote",
      value: "QUOTE"
    },
    {
      name: "Code block",
      value: "CODE_BLOCK"
    }
  ];

  const fontFamilyOptions = [
    'Arial',
    'Courier New',
    'Georgia',
    'Times New Roman',
    'Trebuchet MS',
    'Verdana'
  ];

  const fontSizes = [
   '10px',
   '11px',
   '12px',
   '13px',
   '14px',
   '15px',
   '16px',
   '17px',
   '18px',
   '19px',
   '20px'
  ];

  const INSERT_BUTTONS = [
    {
      text: "Rule",
      command: "INSERT_RULE",
      props: null,
      directCommand: true
    },
    {
      text: "Image",
      command: () => setImageToolbar(true),
      props: null,
      directCommand: false
    },
    {
      text: "InlineImage",
      command: () => showModal('Insert inline image', (onClose) => (
      <InsertInlineImageDialog
          saveImage={insertInlineImage}
          onClose={onClose}
      />
      )),
      props: null,
      directCommand: false
    },
    {
      text: "Tweet",
      command: () => setTweetToolbar(true),
      props: null,
      directCommand: false
    },
    {
      text: "Video",
      command: () => setVideoToolbar(true),
      props: null,
      directCommand: false
    },
    {
      text: "Table",
      command: insertTable,
      props: null,
      directCommand: false
    },
    {
      text: "Latex",
      command: "INSERT_EQUATION",
      props: {
        equation: 'f(x)',
        inline: true
      },
      directCommand: true
    },
    {
      text: "Excalidraw",
      command: "INSERT_EXCALIDRAW",
      props: null,
      directCommand: true
    },
    {
      text: "Block spoiler (Collapsible)",
      command: "INSERT_BLOCK_SPOILER",
      props: null,
      directCommand: true
    },
    {
      text: "Citation block",
      command: "INSERT_CITE_QUOTE",
      props: {
        author: { name: 'Shakespeare', link: 'https://en.wikipedia.org/wiki/William_Shakespeare' },
        source: { content: QUOTE_STATE, link: 'https://en.wikipedia.org/wiki/Romeo_and_Juliet' }
      },
      directCommand: true
    },
    {
      text: "UNDO",
      command:"UNDO",
      props: null,
      directCommand: true
    },
    {
      text: "REDO",
      command:"REDO",
      props: null,
      directCommand: true
    }
  ];

  const CODE_LANGUAGE_OPTIONS = [
    ['', '- Select language -'],
    ...getCodeLanguageOptions()
  ];
  const SUPPORT_SPEECH_RECOGNITION =
    'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;

  let text = "";
  let insertFn: MouseEventHandler<HTMLButtonElement> | undefined;
  let cancelFn: MouseEventHandler<HTMLButtonElement> | undefined;
  const altToolbar = isTweetToolbar || isVideoToolbar || isImageToolbar;
  if(altToolbar){
    text = isTweetToolbar ? "Insert Tweet" : (isVideoToolbar ? "Insert Video" :  "Insert image");
    insertFn = isTweetToolbar ? insertTweet : (isVideoToolbar ? insertVideo :  insertImage);
    cancelFn = isTweetToolbar ? toggleTweetToolbar : (isVideoToolbar ? toggleVideoToolbar :  toggleImageToolbar);
  }

  const clearClickFn = () => containerRef.current?.clear();
  const getContentClickFn = () => {
    const content = containerRef.current?.getContent();
    setEditorState(content === undefined ? null : content);
  }

  return(
  <>
    <button
      onClick={clearClickFn}>
      Clear
    </button>
    <button
      onClick={getContentClickFn}>
      Content
    </button>
    {BUTTON_ELEMENTS.map(elem => (
      <button
        key={elem.text}
        onClick={() => containerRef.current?.executeCommand(elem.command, elem.props)}>
        {elem.text} { elem.isActive ? "(X)" : ""}
      </button>
      ))}
    <br />
    {INSERT_BUTTONS.map(elem => (
      <button
        key={elem.text}
        onClick={
        () => {
          elem.directCommand ?
          containerRef.current?.executeCommand(
            (typeof elem.command === 'string' ?
            elem.command : ''), elem.props) :
          (typeof elem.command === 'function'  ? elem.command() : alert("ERROR"))
        }}>
        {elem.text}
      </button>
      ))}
    <br />
    {formats.canUndo ? "[CAN UNDO]" : "[CAN'T UNDO]"}
    <br />
    {formats.canRedo ? "[CAN REDO]" : "[CAN'T REDO]"}
    <br />
    <div>
      { formats.blockType === "code" ? (
        <>
          <select
            name="block-format"
            id="block-format-select"
            value={blockFormatMap[formats.blockType]}
            onChange={(e) => blockFormatChangeFn(e.target.value)}
          >
            <option value="">--Please choose an option--</option>
            {BLOCK_FORMATS.map(fmt => (
              <option key={fmt.value} value={fmt.value}>{fmt.name}</option>
            ))}
          </select>
          <select
            name="code-format"
            id="code-format-select"
            value={formats.codeLanguage}
            onChange={(e) => codeLanguageChange(e.target.value)}
          >
            {CODE_LANGUAGE_OPTIONS.map(([value, name]) => (
             <option key={value} value={value}>{name}</option>
            ))}
          </select>
        </>
      ) : (
      <div>
        <select
          name="block-format"
          id="block-format-select"
          value={blockFormatMap[formats.blockType]}
          onChange={(e) => blockFormatChangeFn(e.target.value)}
        >
          <option value="">--Please choose an option--</option>
          {BLOCK_FORMATS.map(fmt => (
            <option key={fmt.value} value={fmt.value}>{fmt.name}</option>
          ))}
        </select>
        <select
          name="font-family-select"
          id="font-family-select"
          value={formats.fontFamily}
          onChange={(e) => fontFamilyChangeFn(e.target.value)}
        >
        {fontFamilyOptions.map(f =>
          <option value={f} key={f}>{f}</option>
        )}
        </select>
        <select
          name="font-size-select"
          id="font-size-select"
          value={formats.fontSize}
          onChange={(e) => fontSizeChange(e.target.value)}
        >
        {fontSizes.map(f =>
          <option value={f} key={f}>{f}</option>
        )}
        </select>
      </div>
      )
    }
    </div>
    <div>
      {SUPPORT_SPEECH_RECOGNITION ? (
        <button
          onClick={() => {
            if(!containerRef.current)
              return;
            containerRef.current.executeCommand("SPEECH_TO_TEXT", !isSpeechToText)
            setIsSpeechToText(!isSpeechToText);
          }}
        >
          SPEECH TO TEXT {isSpeechToText ? "(X)": ""}
       </button>
       ) : null}
    </div>
    <br />
    <br />
    { altToolbar &&
      <>
      <URLToolbar
        insertFn={insertFn}
        cancelFn={cancelFn}
        setUrl={setUrl}
        text={text}
      />
      <hr />
      </>
    }
    <Editor
      containerRef={containerRef}
      setFormats={setFormats}
      config={config}
    />
    <br />
    <div style={{display:'flex'}}>
      <span style={{marginRight:'40px'}}>
         <p>Color picker</p>
         <SketchPicker
           color={formats.fontColor}
           onChange={fontColorSelect}
         />
      </span>
      <span>
        <p>Background color picker</p>
        <SketchPicker
          color={formats.bgColor}
          onChange={bgColorSelect}
        />
      </span>
   </div>
   <br />
   <div>
     {editorState === null ? "<Nothing to render>" : JSON.stringify(editorState)}
   </div>
    {inlineImageModal}
  </>
  )
}

const editorComposerStory : Meta<typeof EditorComposer> = {
  title: 'Composer editor',
  component: EditorComposer,
};

export default editorComposerStory;
