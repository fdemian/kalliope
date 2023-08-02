import MentionTypeaheadOption from './MentionTypeaheadOption';

const DefaultListItem = ({ option }) => {
  return <span className="text">{option.name}</span>;
};

type MentionsTypeAheadProps = {
  index: number;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  option: MentionTypeaheadOption;
  entryComponent: JSX.Element;
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

  const EntryComponent = entryComponent ?? DefaultListItem;

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
