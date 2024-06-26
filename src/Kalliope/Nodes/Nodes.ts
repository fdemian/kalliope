/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 */
import type { Klass, LexicalNode } from 'lexical';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { MarkNode } from '@lexical/mark';
import { OverflowNode } from '@lexical/overflow';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { EmojiNode } from './EmojiNode/EmojiNode';
import { MentionNode } from './MentionNode/MentionNode';
import { KeyboardNode } from './Keyboard/Keyboard';
import { SpoilerNode } from './Spoiler/SpoilerNode';
import { ImageNode } from './ImageNode/ImageNode';
import { TweetNode } from './TweetNode/TweetNode';
import { InstagramNode } from './InstagramNode/Index';
import { EquationNode } from './Equation/EquationNode';
import { LayoutContainerNode } from "./Layout/LayoutContainerNode";
import { LayoutItemNode } from "./Layout/LayoutItemNode";
import { VideoNode } from './VideoNode/VideoNode';
import { ExcalidrawNode } from './ExcalidrawNode';
import { InlineImageNode } from "./InlineImageNode/InlineImageNode";
import { CiteNode } from './CiteNode/CiteNode';
import { CollapsibleContainerNode } from '../Plugins/CollapsiblePlugin/CollapsibleContainerNode';
import { CollapsibleContentNode } from '../Plugins/CollapsiblePlugin/CollapsibleContentNode';
import { CollapsibleTitleNode } from '../Plugins/CollapsiblePlugin/CollapsibleTitleNode';
import { FigmaNode } from "./FigmaNode/FigmaNode";
import { PageBreakNode } from "./PageBreak";

const Nodes: Klass<LexicalNode>[] = [
  ListNode,
  ListItemNode,
  AutoLinkNode,
  LinkNode,
  MentionNode,
  EmojiNode,
  KeyboardNode,
  OverflowNode,
  SpoilerNode,
  HeadingNode,
  FigmaNode,
  InstagramNode,
  QuoteNode,
  CodeHighlightNode,
  CodeNode,
  HorizontalRuleNode,
  ImageNode,
  TweetNode,
  TableCellNode,
  TableNode,
  TableRowNode,
  EquationNode,
  VideoNode,
  ExcalidrawNode,
  CiteNode,
  InlineImageNode,
  CollapsibleContainerNode,
  CollapsibleContentNode,
  CollapsibleTitleNode,
  PageBreakNode,
  MarkNode,
  LayoutContainerNode,
  LayoutItemNode
];

export default Nodes;
