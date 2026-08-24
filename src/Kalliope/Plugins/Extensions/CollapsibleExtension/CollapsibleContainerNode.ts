
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
// @ts-nocheck
import {
  $getSiblingCaret,
  $isElementNode,
  $rewindSiblingCaret,
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  ElementNode,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  RangeSelection,
  SerializedElementNode,
  Spread,
} from 'lexical';

type SerializedCollapsibleContainerNode = Spread<
  {
    open: boolean;
  },
  SerializedElementNode
>;

export function convertDetailsElement(
  domNode: HTMLDetailsElement,
): DOMConversionOutput | null {
  const isOpen = domNode.open !== undefined ? domNode.open : true;
  const node = $createCollapsibleContainerNode(isOpen);
  return {
    node,
  };
}

export class CollapsibleContainerNode extends ElementNode {
  __open: boolean;

  constructor(open: boolean, key?: NodeKey) {
    super(key);
    this.__open = open;
  }

  static getType(): string {
    return 'collapsible-container';
  }

  static clone(node: CollapsibleContainerNode): CollapsibleContainerNode {
    return new CollapsibleContainerNode(node.__open, node.__key);
  }

  isShadowRoot(): boolean {
    return true;
  }

  collapseAtStart(selection: RangeSelection): boolean {
    // Unwrap the CollapsibleContainerNode by replacing it with the children
    // of its children (CollapsibleTitleNode, CollapsibleContentNode)
    const nodesToInsert: LexicalNode[] = [];
    for (const child of this.getChildren()) {
      if ($isElementNode(child)) {
        nodesToInsert.push(...child.getChildren());
      }
    }
    const caret = $rewindSiblingCaret($getSiblingCaret(this, 'previous'));
    caret.splice(1, nodesToInsert);
    // Merge the first child of the CollapsibleTitleNode with the
    // previous sibling of the CollapsibleContainerNode
    const [firstChild] = nodesToInsert;
    if (firstChild) {
      firstChild.selectStart().deleteCharacter(true);
    }
    return true;
  }

  createDOM(config: EditorConfig, editor: LexicalEditor): HTMLElement {
    const dom = document.createElement('details');
    dom.classList.add('Collapsible__container');
    dom.open = this.__open;
    dom.addEventListener('toggle', () => {
      const open = editor.getEditorState().read(() => this.getOpen());
      if (open !== dom.open) {
        editor.update(() => this.toggleOpen());
      }
    });
    return dom;
  }

  updateDOM(
    prevNode: this,
    dom: HTMLDetailsElement,
  ): boolean {
    if (prevNode.__open !== this.__open) {
      dom.open = this.__open;
    }

    return false;
  }

  static importDOM(): DOMConversionMap<HTMLDetailsElement> | null {
    return {
      details: (domNode: HTMLDetailsElement) => {
        return {
          conversion: convertDetailsElement,
          priority: 1,
        };
      },
    };
  }

  static importJSON(
    serializedNode: SerializedCollapsibleContainerNode,
  ): CollapsibleContainerNode {
    const node = $createCollapsibleContainerNode(serializedNode.open);
    return node;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('details');
    element.classList.add('Collapsible__container');
    element.setAttribute('open', this.__open.toString());
    return {element};
  }

  exportJSON(): SerializedCollapsibleContainerNode {
    return {
      ...super.exportJSON(),
      open: this.__open,
      type: 'collapsible-container',
      version: 1,
    };
  }

  setOpen(open: boolean): void {
    const writable = this.getWritable();
    writable.__open = open;
  }

  getOpen(): boolean {
    return this.getLatest().__open;
  }

  toggleOpen(): void {
    this.setOpen(!this.getOpen());
  }
}

export function $createCollapsibleContainerNode(
  isOpen: boolean,
): CollapsibleContainerNode {
  return new CollapsibleContainerNode(isOpen);
}

export function $isCollapsibleContainerNode(
  node: LexicalNode | null | undefined,
): node is CollapsibleContainerNode {
  return node instanceof CollapsibleContainerNode;
}