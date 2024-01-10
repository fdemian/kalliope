declare module 'kalliope' {
    import { LexicalEditor } from "lexical";
    export const getCodeLanguageOptions: () => [string, string][];
    export default LexicalEditor;
};