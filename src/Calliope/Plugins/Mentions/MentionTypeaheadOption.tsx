import { TypeaheadOption } from '@lexical/react/LexicalTypeaheadMenuPlugin';

class MentionTypeaheadOption extends TypeaheadOption {
  name: string;
  link: string;
  avatar: string;

  constructor(name: string, link: string, avatar: string) {
    super(name);
    this.name = name;
    this.link = link;
    this.avatar = avatar;
  }
}

export default MentionTypeaheadOption;
