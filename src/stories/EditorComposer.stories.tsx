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
import {LexicalEditor} from "lexical";

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

type InlineImageModalProps = {
  activeEditor: LexicalEditor;
  nodeKey: string;
};

type InlineImageProps = {
  altText: string;
  position: string;
  showCaption: boolean;
  src: string;
};

export const EditorComposer = () => {
  const containerRef = useRef<null | CalliopeContainerType>(null);
  const [editorState, setEditorState] = useState<string | null>(null);
  const [formats, setFormats] = useState<CalliopeFormatTypes>(initialFormatTypes);
  const [canUndo, setCanUndo] = useState<boolean | null>(false);
  const [canRedo, setCanRedo] = useState<boolean | null>(false);
  const [suggestions, setSuggestions] = useState(initialMentions);
  const [isSpeechToText, setIsSpeechToText] = useState<boolean | null>(false);

  // TOOLBARS
  const [layoutFormat, setLayoutFormat] = useState("1");
  const [isLayoutToolbar, setLayoutToolbar] = useState(false);
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

  const layoutFormatChangeFn = (val: string) => {
    setLayoutFormat(val);
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

  const insertInlineImage = (image: InlineImageProps) => {
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

  const insertFigmaTest = () => {
    if(!containerRef.current)
      return;
    const FIGMA_URL:string = "https://www.figma.com/file/LKQ4FJ4bTnCSjedbRpk931/Sample-File";
    containerRef.current.executeCommand("INSERT_FIGMA_COMMAND", FIGMA_URL);
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
      showModal: (modalProps:InlineImageModalProps) => showModal('Update inline image', (onClose) => (
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

  const blockFormatMap: {[index: string]:string} = {
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

  const LAYOUT_FORMATS = [
    {key: "1", name: '2 columns (equal width)', value: '1fr 1fr'},
    {key: "2", name: '2 columns (25% - 75%)', value: '1fr 3fr'},
    {key: "3", name: '3 columns (equal width)', value: '1fr 1fr 1fr'},
    {key: "4", name: '3 columns (25% - 50% - 25%)', value: '1fr 2fr 1fr'},
    {key: "5", name: '4 columns (equal width)', value: '1fr 1fr 1fr 1fr'},
  ];

  const insertColumnLayout = () => {
    if(!containerRef.current)
      return;

    const lf:any = LAYOUT_FORMATS.find(l => l.key == layoutFormat);

    if(lf === undefined)
      return;

    const actualFormat: string = lf.value;
    containerRef.current.executeCommand("INSERT_LAYOUT_COMMAND", actualFormat);
    setLayoutToolbar(false);
  }

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
      text: "Figma drawing",
      command: insertFigmaTest,
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
      text: "Page break",
      command: "INSERT_PAGE_BREAK",
      props: null,
      directCommand: true
    },
    {
      text: "Columns Layout",
      command: () => setLayoutToolbar(true),
      props: null,
      directCommand: false
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

  const altToolbar =  isTweetToolbar || isVideoToolbar || isImageToolbar;
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
    {canUndo ? "[CAN UNDO]" : "[CAN'T UNDO]"}
    <br />
    {canRedo ? "[CAN REDO]" : "[CAN'T REDO]"}
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
    {
      isLayoutToolbar &&
      <>
        <strong>Layout toolbar &nbsp;</strong>
        <select
          name="layout-format"
          id="layout-format-select"
          value={layoutFormat}
          onChange={(e) => layoutFormatChangeFn(e.target.value)}
        >
          {LAYOUT_FORMATS.map(fmt => (
              <option key={fmt.key} value={fmt.key}>{fmt.name}</option>
          ))}
        </select>
        <button onClick={insertColumnLayout}>Insert</button>
     </>
    }
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
      setCanUndo={setCanUndo}
      setCanRedo={setCanRedo}
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
