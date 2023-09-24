import {createCommand, LexicalCommand} from "lexical";
import {InsertImagePayload} from "./ImagesPlugin";

export const INSERT_IMAGE_COMMAND: LexicalCommand<InsertImagePayload> = createCommand();
