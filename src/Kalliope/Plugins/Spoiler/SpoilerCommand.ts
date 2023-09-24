import {createCommand, LexicalCommand} from "lexical";

export const INSERT_SPOILER_COMMAND: LexicalCommand<{ text: string }> = createCommand();
