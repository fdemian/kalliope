import MentionTypeaheadOption from './MentionTypeaheadOption';

type ListItemParams = {
  option: {
    name: string;
  }
};

export type EntryComponentType = (param: ListItemParams) => JSX.Element;

const DefaultListItem = ({ option }: ListItemParams) => {
  return <span className="text">{option.name}</span>;
};

type MentionsTypeAheadProps = {
  index: number;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  option: MentionTypeaheadOption;
  entryComponent: EntryComponentType;
};

export const MentionsTypeaheadMenuItem = ({
  index,
  isSelected,
  onClick,
  onMouseEnter,
  option,
  entryComponent
}: MentionsTypeAheadProps) => {
  let className = 'item';
  if (isSelected) {
    className += ' selected';
  }

  const EntryComponent: EntryComponentType = entryComponent ?? DefaultListItem;

  return (
    <li
      id={'typeahead-item-' + index}
      role="option"
      ref={option.setRefElement}
      aria-selected={isSelected}
      key={'typeahead-item-' + index}
      tabIndex={-1}
      className={className}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      <EntryComponent option={option} />
    </li>
  );
}
