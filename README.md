# Kalliope

<img src="https://github.com/fdemian/kalliope/blob/main/Kalliope.png" alt="Kalliope" />

![Install and build](https://img.shields.io/github/actions/workflow/status/fdemian/kalliope/.github/workflows/build-and-test.yml)

An extensible WYSWYG editor based on [Lexical](https://lexical.dev/).

# What is Kalliope?

Kalliope is a ready-to-use editor based on lexical. It is intended to be easy to use and ships with several ready to use plugins.

It does not contain a graphical interface beyond that of the editor itself, and is therefore not tied to any particular UI.

# Overview

- [Built in plugins](#built-in-plugins)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Utility functions](#utility-functions)
- [Editor commands](#editor-commands)
- [Valid code languages](#valid-code-languages)


# Built in plugins

- Code highlight and code formatting.
- Drag and drop images.
- Emojis (english default).
- Floating link editor.
- Table cell.
- Mentions
- Citation block
- Speech to text
- Text spoiler
- Block spoiler (collapsible)
- Insert tweets
- Insert videos (Youtube, Facebook, Dailymotion, Soundcloud, Twitch).
- Basic formatting (bold, italic, underline, strikethrough, superscript, subscript).
- Text coloring (font and background).
- Different font types
- Different block types (heading, bullet list, numbered list, check list, quote and code block).

# Installation

## Install the yarn pacakge.

`yarn add kalliope`

## Import the editor

`import CalliopeEditor from 'kalliope';`

# Usage

The editor component takes three parameters

 - config (*required*) : an object containing configuration options (detailed below).
 - containerRef (*required*): a react ref used to manipulate the editor.
 - setFormats (*optional*): a function used to set the formats applied to the selected text. Useful when building UIs.

```
<CalliopeEditor
  config={config}
  containerRef={containerRef}
  setFormats={setFormats}
/>
```

# Configuration

The configuration object (`config` parameter) looks like this.

```
{
  placeholderText: t('toolbar.placeholderText'),
  initialState: initialState,
  isReadOnly: false,
  autoFocus: true,
  onError: (error) => {
    throw error;
  },
  plugins: [],
  imageConfig: {
    addCaptionText: t('internal.addCaption'),
    defaultCaptionText: t('internal.enterCaption'),
  },
  twitterConfig: {
    loadingComponent: ({ tweetId }) => (
      <p>
        {t('internal.loadingTweet')}...(ID={tweetId})
      </p>
    ),
  },
  collapsibleConfig: {
    open: true,
  },
  citation: {
    sourceLinkComponent: ({ sourceLink }) => (
      <a href={sourceLink} className="source-link-component">
        <FontAwesomeIcon icon={sourceIcon} size="lg" />
      </a>
    ) /*,
    authorComponent: ({ author }) => (
      <a href={author.link} className="author-link-container">
        <AccountAvatar
          avatar={author.avatar}
          username={author.name}
          size="5px"
          shape="circle"
        />
        <span className="author-link-quote">{author.name}</span>
      </a>
    ),*/,
  },
  mentions: {
    onSearchChange: onSearchChange,
    onAddMention: (mention) => {
      setMentions([...mentions, mention.name]);
    },
    onRemoveMention: ({ name, link }) => {
      const newMentions = mentions.filter((m) => m !== name);
      setMentions(newMentions);
    },
    entryComponent: ({ option: { avatar, name, link } }) => (
      <>
        <AccountAvatar avatar={avatar} username={name} size="5px" shape="circle" />
        &nbsp; <strong className="user-name-mentions">{name}</strong>
      </>
    ),
    mentionsData: suggestions,
  },
  emojiConfig: {
    emojiData: emojiData,
  },
  dragAndDropImage: {
    handleDroppedFile: async (file) => {
      const resp = await uploadFileToServer(file);
      const { src } = resp;

      if (src === null) {
        notification.error({
          message: 'Failed to upload File',
          description: "Couldn't upload file to the server (file type not allowed).",
          placement: 'topRight',
        });
        return;
      }
      const imageSrc = `/static/uploads/${src}`;
      containerRef.current.executeCommand('INSERT_IMAGE', {
        src: imageSrc,
        altText: file.name,
      });
    },
  },
}
```

# Utility functions

Accesible using the `containerRef` ref.

<table class="table table-bordered table-striped">
   <thead>
     <tr>
       <th style="width: 100px;">Name</th>
       <th style="width: 50px;">Parameters</th>
       <th>Description</th>
     </tr>
   </thead>
   <tbody>
     <tr>
       <td>getContent</td>
       <td> () => <a href="https://lexical.dev/docs/concepts/editor-state/">Lexical Editor State</a></td>
       <td>
 	      Gets get the current editor content. Returns a <a href="https://lexical.dev/docs/concepts/editor-state/">Lexical Editor State</a> as JSON.
 	     </td>
    </tr>   
 	  <tr>
       <td>clear</td>
       <td> () => void </td>
       <td>Clears the editor.</td>
    </tr>
    <tr>
       <td>executeCommand</td>
       <td>({commandName: <code>string</code>, commandParams: <code>any</code>}) => <code>void</code></td>
       <td>Executes and editor command (toggle a block or a font style).</td>
    </tr>
    <tr>
       <td>focus</td>
       <td>() => <code>void</code></td>
       <td>Sets the focus for the editor.</td>
    </tr>
   </tbody>
 </table>

# Editor commands

<table class="table table-bordered table-striped">
   <thead>
     <tr>
       <th>Name</th>
       <th>Parameters</th>
       <th>Description</th>
     </tr>
   </thead>
   <tbody>
     <tr>
       <td>UNDO</td>
       <td>none</td>
 	     <td>Undo last command</td>
    </tr>
    <tr>
      <td>REDO</td>
      <td>none</td>
      <td>Redo last undone command</td>
   </tr>
    <tr>
      <td>FORMAT</td>
      <td><code>string</code>. One of <code>bold| italic | underline | strikethrough | superscript | subscript | code</code></td>
      <td>Apply basic text formatting.</td>
    </tr>
    <tr>
      <td>KEYBOARD</td>
      <td>none</td>
      <td>Apply keyboard formatting.</td>
    </tr>
    <tr>
      <td>SPOILER</td>
      <td>none</td>
      <td>Apply text spoiler formatting.</td>
    </tr>
    <tr>
      <td>LINK</td>
      <td><code>string</code> link to insert</td>
      <td>Insert link</td>
    </tr>
    <tr>
      <td>ALIGN</td>
      <td><code>string</code> one of <code>left | center | right | justify</code></td>
      <td>Insert link</td>
    </tr>
    <tr>
      <td>INDENT</td>
      <td>none</td>
      <td>Indent text</td>
    </tr>
    <tr>
      <td>OUTDENT</td>
      <td>none</td>
      <td>Outdent text</td>
    </tr>
    <tr>
      <td>PARAGRAPH</td>
      <td>none</td>
      <td>Apply paragraph block style to selected text</td>
    </tr>
    <tr>
      <td>BULLET_LIST</td>
      <td>none</td>
      <td>Apply bullet list formatting to selected text</td>
    </tr>
    <tr>
      <td>NUMBERED_LIST</td>
      <td>none</td>
      <td>Apply numbered list formatting to selected text</td>
    </tr>
    <tr>
      <td>CHECK</td>
      <td>none</td>
      <td>Apply check list formatting to selected text</td>
    </tr>
    <tr>
      <td>H1</td>
      <td>none</td>
      <td>Apply h1 formatting to selected text</td>
    </tr>
    <tr>
      <td>H2</td>
      <td>none</td>
      <td>Apply h2 formatting to selected text</td>
    </tr>
    <tr>
      <td>H3</td>
      <td>none</td>
      <td>Apply h3 formatting to selected text</td>
    </tr>
    <tr>
      <td>QUOTE</td>
      <td>none</td>
      <td>Apply quote block formatting to selected text</td>
    </tr>
    <tr>
      <td>CODE_BLOCK</td>
      <td>none</td>
      <td>Apply code block formatting (w/format highlighting) to selected text.</td>
    </tr>
    <tr>
      <td>CODE_LANGUAGE_CHANGE</td>
      <td><code>value</code>: string - a code language. See list of valid code languages below</td>
      <td>Change the code language inside a code block. The current block must already be a code block for this method to work.</td>
    </tr>
    <tr>
      <td>CHANGE_FONT</td>
      <td><code>string</code> a valid font family.
      Suggested values are (<code>Arial</code>, <code>Courier New</code>, <code>Georgia</code>, <code>Times New Roman</code>, <code>Trebuchet MS</code>, <code>Verdana</code>)</td>
      <td>Chang the font family type.</td>
    </tr>
    <tr>
      <td>CHANGE_FONT_SIZE</td>
      <td>string a valid font size. '<number>px' (ie: <code>'10px'</code>)</td>
      <td>Chang the font size.</td>
    </tr>
    <tr>
      <td>CHANGE_FONT_COLOR</td>
      <td>string a valid hexadecimal color value.</td>
      <td>Change the font color.</td>
    </tr>
    <tr>
      <td>CHANGE_FONT_BG_COLOR</td>
      <td>string a valid hexadecimal color value.</td>
      <td>Change the background color.</td>
    </tr>
    <tr>
      <td>INSERT_RULE</td>
      <td>none</td>
      <td>Insert a horizontal rule.</td>
    </tr>
    <tr>
      <td>INSERT_IMAGE</td>
      <td>object { altText: <code>string</code>, src: <code>string</code> }. src is the image url. alt text is the alt text for the image. Neither can be null.
      </td>
      <td>Insert a resizeable image into the editor.</td>
    </tr>
    <tr>
      <td>INSERT_TWEET</td>
      <td>string tweetId. The id in the tweet url (Twitter urls are formatted like this: twitter.com/<username>/status/<tweetId>)
      </td>
      <td>Insert a tweet into the editor.</td>
    </tr>
    <tr>
      <td>INSERT_INSTAGRAM_POST</td>
      <td>string instagramURL. The instagram URL (Instagram urls are formatted like this: "https://www.instagram.com/p/<ID>/")
      </td>
      <td>Insert an instagram post into the editor (only works for public instagram links).</td>
    </tr>
    <tr>
      <td>INSERT_TABLE</td>
      <td>object {columns: <code>integer</code>, rows: <code>integer</code>}
      </td>
      <td>Insert a table into the editor.</td>
    </tr>
    <tr>
      <td>INSERT_EQUATION</td>
      <td>object { equation: <code>string</code>, inline: <code>boolean</code> }. The equation must be a valid latex formula. Inline specifies wether the equation is rendered on its own line or not.
      </td>
      <td>Insert a LaTeX equation into the editor. Only Valid Katex formulas accepted.</td>
    </tr>
    <tr>
      <td>INSERT_VIDEO</td>
      <td>url: <code>string</code> . The URL of the video in question. Look below for accepted video sites.
      </td>
      <td>Insert video content into the editor.</td>
    </tr>
    <tr>
      <td>INSERT_EXCALIDRAW</td>
      <td>none</td>
      <td>
      Open excalidraw popup. This does not insert anything into the editor, the insertion is done when the user clicks the save button.
      </td>
    </tr>
    <tr>
      <td>INSERT_BLOCK_SPOILER</td>
      <td>open: <code>boolean</code></td>
      <td>Insert block spoiler (a collapsible container akin to html's summary).</td>
    </tr>
    <tr>
      <td>SPEECH_TO_TEXT</td>
      <td>isSpeechToText: <code>boolean</code> - indicates wether speech to text is active or not</td>
      <td>Open the microphone to convert speech to text. When switched off it will insert the captured text into the editor</td>
    </tr>
    <tr>
      <td>INSERT_CITE_QUOTE</td>
      <td>
      {
        author: { name: <code>string</code>, link: <code>string</code>},
        source: { content: <code>string</code>, link: <code>string</code> }
      }
      </td>
      <td>Insert a citation.</td>
    </tr>
  </tbody>
</table>

# Valid code languages

A list of valid code languages is exported from the editor. To obtain the list do

```
import { getCodeLanguageOptions } from 'kalliope';

const CODE_LANGUAGES = getCodeLanguageOptions(false);
```

The following code languages are accepted by the highlighter. The value column indicates the value passed as the parameter of the `CHANGE_CODE_LANGUAGE` command.

<table class="table table-bordered table-striped">
   <thead>
     <tr>
       <th>Value</th>
       <th>Language</th>
     </tr>
   </thead>
   <tbody>
     <tr>
       <td>c</td>
       <td>C</td>
      </tr>
      <tr>
        <td>clike</td>
        <td>C-Like</td>
       </tr>
       <tr>
         <td>objc</td>
         <td>Objective-C</td>
        </tr>
        <tr>
         <td>html</td>
         <td>HTML</td>
        </tr>     
        <tr>
         <td>xml</td>
         <td>XML</td>
        </tr>        
        <tr>
          <td>css</td>
          <td>CSS</td>
        </tr>
        <tr>
          <td>sql</td>
          <td>SQL</td>
        </tr>
        <tr>
          <td>js</td>
          <td>JavaScript</td>
        </tr>
        <tr>
          <td>markdown</td>
          <td>Markdown</td>
        </tr>
        <tr>
          <td>py</td>
          <td>Python</td>
        </tr>
        <tr>
          <td>powershell</td>
          <td>Powershell</td>
        </tr>
        <tr>
          <td>rust</td>
          <td>Rust</td>
        </tr>
        <tr>
          <td>swift</td>
          <td>Swift</td>
        </tr>
        <tr>
          <td>plain</td>
          <td>Plain Text</td>
        </tr>
        <tr>
          <td>ts</td>
          <td>Typescript</td>
        </tr>
    </tbody>
</table>
