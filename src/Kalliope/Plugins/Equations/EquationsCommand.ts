import {createCommand, LexicalCommand} from "lexical";

export type CommandPayload = {
    equation: string;
    inline: boolean;
};

export const INSERT_EQUATION_COMMAND: LexicalCommand<CommandPayload> = createCommand("INSERT_EQUATION_COMMAND");