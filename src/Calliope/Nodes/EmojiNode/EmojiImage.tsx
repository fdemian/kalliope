import { shortnameToUnicode } from 'emoji-toolkit';

type EmojiNodeProps = {
  emoji: string;
}

const EmojiNode = ({ emoji }: EmojiNodeProps) => {
  return <span>{shortnameToUnicode(emoji)}</span>;
};

export default EmojiNode;
