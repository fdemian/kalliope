import { MenuOption } from '@lexical/react/LexicalTypeaheadMenuPlugin';

export class MentionTypeaheadOption extends MenuOption {
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
