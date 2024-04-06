/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {
    DOMConversionMap,
    DOMConversionOutput,
    DOMExportOutput,
    EditorConfig,
    ElementFormatType,
    LexicalEditor,
    LexicalNode,
    NodeKey,
    Spread,
  } from 'lexical';
  
  import { BlockWithAlignableContents } from '@lexical/react/LexicalBlockWithAlignableContents';
  import { CalliopeContext } from '../../context';
  import {
    DecoratorBlockNode,
    SerializedDecoratorBlockNode,
  } from '@lexical/react/LexicalDecoratorBlockNode';
  import { useCallback, useContext, useEffect, useRef, useState } from 'react';
  import './TweetNode.css';
  
  const WIDGET_SCRIPT_URL = 'https://platform.twitter.com/widgets.js';
  

  const BASE_IG_URL = "https://www.instagram.com/p/";
  const getEmbedUrl = (igUrl) => BASE_IG_URL + igUrl.split("p/")[1] + "embed/";

  type InstagramComponentProps = Readonly<{
    className: Readonly<{
      base: string;
      focus: string;
    }>;
    format: ElementFormatType | null;
    nodeKey: NodeKey;
    onError?: (error: string) => void;
    onLoad?: () => void;
    tweetId: string;
  }>;
  
  type LoadingTweetProps = {
    tweetId: string;
  };
  type LoadingTweetElementProps = ({ tweetId }: LoadingTweetProps) => JSX.Element;
  
  function convertTweetElement(domNode: HTMLDivElement): DOMConversionOutput | null {
    const id = domNode.getAttribute('data-lexical-tweet-id');
    if (id) {
      const node = $createInstagramNode(id);
      return { node };
    }
    return null;
  }
  
  let isTwitterScriptLoading = true;
  
  function InstagramNode({
    className,
    format,
    nodeKey,
    onError,
    onLoad,
    tweetId,
  }: InstagramComponentProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
  
    const previousTweetIDRef = useRef<string>('');
    const [isTweetLoading, setIsTweetLoading] = useState(false);
  
    const createTweet = useCallback(async () => {
      try {
        // @ts-expect-error Twitter is attached to the window.
        await window.twttr.widgets.createTweet(tweetId, containerRef.current);
  
        setIsTweetLoading(false);
        isTwitterScriptLoading = false;
  
        if (onLoad) {
          onLoad();
        }
      } catch (error) {
        if (onError) {
          onError(String(error));
        }
      }
    }, [onError, onLoad, tweetId]);
  
    useEffect(() => {
      if (tweetId !== previousTweetIDRef.current) {
        setIsTweetLoading(true);
  
        if (isTwitterScriptLoading) {
          const script = document.createElement('script');
          script.src = WIDGET_SCRIPT_URL;
          script.async = true;
          document.body?.appendChild(script);
          script.onload = createTweet;
          if (onError) {
            script.onerror = onError as OnErrorEventHandler;
          }
        } else {
          createTweet();
        }
  
        if (previousTweetIDRef) {
          previousTweetIDRef.current = tweetId;
        }
      }
    }, [createTweet, onError, tweetId]);
  
    let LoadingComponent: LoadingTweetElementProps = ({tweetId}) => <p>Loading (ID=${tweetId})</p>;
    const calliopeConfig = useContext(CalliopeContext);
  
    if(!calliopeConfig)
      return null;
    
    const { config } = calliopeConfig;
    if(config !== null && config.twitterConfig) {
      LoadingComponent = config.twitterConfig.loadingComponent;
    }
  
    return (
      <BlockWithAlignableContents
        className={className}
        format={format}
        nodeKey={nodeKey}
      >
        {isTweetLoading ? <LoadingComponent tweetId={tweetId} /> : null}
        <div className="tweet-node" ref={containerRef} />
      </BlockWithAlignableContents>
    );
  }
  
  export type SerializedTweetNode = Spread<
    {
      id: string;
      type: 'tweet';
      version: 1;
    },
    SerializedDecoratorBlockNode
  >;
  
  export class InstagramNode extends DecoratorBlockNode {
    __id: string;
  
    static getType(): string {
      return 'tweet';
    }
  
    static clone(node: InstagramNode): InstagramNode {
      return new InstagramNode(node.__id, node.__format, node.__key);
    }
  
    static importJSON(serializedNode: SerializedTweetNode): InstagramNode {
      const node = $createInstagramNode(serializedNode.id);
      node.setFormat(serializedNode.format);
      return node;
    }
  
    exportJSON(): SerializedTweetNode {
      return {
        ...super.exportJSON(),
        id: this.getId(),
        type: 'tweet',
        version: 1,
      };
    }
  
    static importDOM(): DOMConversionMap<HTMLDivElement> | null {
      return {
        div: (domNode: HTMLDivElement) => {
          if (!domNode.hasAttribute('data-lexical-tweet-id')) {
            return null;
          }
          return {
            conversion: convertTweetElement,
            priority: 2,
          };
        },
      };
    }
  
    exportDOM(): DOMExportOutput {
      const element = document.createElement('div');
      element.setAttribute('data-lexical-tweet-id', this.__id);
      const text = document.createTextNode(this.getTextContent());
      element.append(text);
      return { element };
    }
  
    constructor(id: string, format?: ElementFormatType, key?: NodeKey) {
      super(format, key);
      this.__id = id;
    }
  
    getId(): string {
      return this.__id;
    }
  
    getTextContent(): string {
      return `https://twitter.com/i/web/status/${this.__id}`;
    }
  
    // @ts-ignore
    decorate(editor: LexicalEditor, config: EditorConfig): JSX.Element {
      const embedBlockTheme = config.theme.embedBlock || {};
      const className = {
        base: embedBlockTheme.base || '',
        focus: embedBlockTheme.focus || '',
      };
  
      return (
      <iframe src="">


      </iframe>
      );
    }
  
  }
  
  export function $createInstagramNode(instagramURL: string): TweetNode {
    return new InstagramNode(instagramURL);
  }
  
  export function $isTweetNode(
    node: InstagramNode | LexicalNode | null | undefined
  ): node is InstagramNode {
    return node instanceof InstagramNode;
  }
  