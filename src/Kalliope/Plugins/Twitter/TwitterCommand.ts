import {createCommand, LexicalCommand} from "lexical";

export const INSERT_TWEET_COMMAND: LexicalCommand<string> = createCommand('INSERT_TWEET_COMMAND');