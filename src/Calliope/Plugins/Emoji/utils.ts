//import emojiData from 'emojibase-data/en/data.json';

export type Emoji = {
  label: string;
  emoji: string;
  tags?: string[];
}

const priorityList: string[] = [
  '1F44D', // thumbs up
  '1F604', // smile
  '2764', // heart
  '1F44C', // ok_hand
  '1F4AF',
];

// (String, String) -> boolean
const emojiMatch = (emoji: Emoji, query: string) => {
  return (
    emoji.label.toLowerCase().includes(query.toLowerCase()) ||
    (emoji.tags && emoji.tags.includes(query))
  );
};

export { priorityList, emojiMatch };
