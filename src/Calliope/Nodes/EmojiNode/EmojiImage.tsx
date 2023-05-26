import React from 'react';
import { shortnameToUnicode } from 'emoji-toolkit';

const EmojiNode = ({ emoji }: string) => {
  return <span>{shortnameToUnicode(emoji)}</span>;
};

export default EmojiNode;
