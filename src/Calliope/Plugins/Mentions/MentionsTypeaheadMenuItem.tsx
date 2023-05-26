import * as React from 'react';
import MentionTypeaheadOption from './MentionTypeaheadOption';

const DefaultListItem = ({ option }) => {
  return <span className="text">{option.name}</span>;
};

export function MentionsTypeaheadMenuItem({
  index,
  isSelected,
  onClick,
  onMouseEnter,
  option,
  entryComponent,
}: {
  index: number;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  option: MentionTypeaheadOption;
  entryComponent: any;
}) {
  let className = 'item';
  if (isSelected) {
    className += ' selected';
  }

  const EntryComponent = entryComponent ?? DefaultListItem;

  return (
    <li
      id={'typeahead-item-' + index}
      role="option"
      aria-selected={isSelected}
      key={'typeahead-item-' + index}
      tabIndex={-1}
      className={className}
      ref={option}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      <EntryComponent option={option} />
    </li>
  );
}
