# CHANGELOG

Note: this changelog only details lexical changes applied to the main editor.
To find out what's new in a given lexical version see [Lexical's own changelog](https://github.com/facebook/lexical/blob/main/CHANGELOG.md). 

## v0.15.2 (2025-06-26)
- Fix initial status of alignment tracking.

## v0.15.1 (2025-06-26)
- Track alignment states for elements.
- Update more elements.

## v0.15.0 (2025-06-22)
- Update lexical to v0.33.1.
- Fix: close link popup when user clicks out of it.
- Allow deleting empty column layouts via backspace.
- Add ability to change ordered list start number.
- Add code diff highlighting.
- Do not use unused expect-error directives.

## v0.14.0 (2025-06-14)
- Update lexical to v0.31.2.
- Preserve row striping in frozen table columns.
- Made checklist icon fully scalable, clickable, and properly spaced.
- Bug Fix: unbulleting an image doesn't work.

## v0.13.0 (2025-05-20)
- Update lexical to v0.31.2.
- Add punctuation to emoji picker plugin.
- Fix: capitalize shortcut not working in macos.
- LexicalTypeaheadMenuPlugin Positioning When Scrolled.

## v0.12.0 (2025-05-01)
- Update lexical to v0.31.0.
- Clarify EquationComponent inputRef type.
- Migrate string literals to update tag constants.
- Deprecate KEY_MODIFIER_COMMAND and use KEY_DOWN_COMMAND for shortcuts.

## v0.11.1 (2025-04-17)
- Fix code block.
- Update some packages.

## v0.11.0 (2025-04-17)
- Update to React 19.

## v0.10.0 (2025-04-08)
- Update to lexical v0.30.0.
- Add strict indent to list plugin option.
- Remove some deprecated name utils.
- Add support for image links.
- Remove shared imports.
- Improvements to clearFormatting function.
- Use natural dimensions for inherited image size.
- Immediate broken image display on load failure.
- Clear will also clear any indent/outdent if applied.
- Floating toolbar position for end-aligned text.
- Improve logic for pasting table into table.

## v0.9.10 (2025-04-05)
- Upgrade lexical to v0.29.0.
- Fix equation rendering in Safari.
- Fix excalidraw modals which were showing incorrectly.

## v0.9.9 (2025-03-22)

- Update lexical to v0.28.0
- Add plus button to draggable block plugin to add a text block.
- Make table actions actually clear the selection.
- Move ListItemNode text style inheritance to custom properties and CSS.
- Use default delete handler instead of creating one.

## v0.9.8 (2025-03-12)
 - Update lexical to v0.27.2
 - Fix Table Action Menu dropdown positioning
 - Add HR theme config for selected state
 - Apply correct column headers when column contains vertically merged cells
 - Add touch support for TableCellResizer
 - Fix: row height resizing for merged cells

## v0.9.7 (2025-02-27)
 - Toggle first row freeze.
 - Toggle first column freeze.
 - Add add verticalAlign attribute to tables.
 - Bug Fix: Ensure rectangular table cell merge behavior.
 - Add name to collapsible command.
 - Update to lexical v0.25.0
 - Remove special case for collapsible forward deletion
 - Fix Optimize table cell resizer event listeners.
 - Remove redundant Suspense from node decorators.

## v0.9.6 (2025-02-14)
- Update lexical to v0.24.0"
- Add table alignment.
- Fix Columns Layout Item Overflow
- Clean up nested editor update

## v0.9.5 (2025-01-28)
- Update lexical to v0.23.0
- Merge TabIndentionPlugin and ListMaxIndentLevelPlugin plugins.

## v0.9.4 (2025-01-07)
- Add support for finding out if a given text has a capitalization format. 

## v0.9.3 (2025-01-07)
- Update lexical to v0.23.0
- Allow TableSelection to be preserved during contextmenu events.
- Allow scrolling if the table cell content overflows.
- Fix Insertion of multiple rows.
- Fix bug where tabs do not show on strikethrough underline.
- Fix empty layout item causes 100% CPU usage.
- Fix table hover actions button position. 
- Add updateFromJSON and move more textFormattextStyle to ElementNode.
- Support capitalization format.

## v0.9.2 (2024-12-17)
- Update lexical to v0.21.0
- Update katex and storybook. Remove unused logs.
- Fix collapsible container styles.

## v0.9.1 (2024-11-30)
- Update lexical to v0.20.1
- Stop spellchecking mentions
- Fix floating link editor selection
- Fix table actions menu plugin
- Add selectionIsAllwaysOnPlugin (defaults to false).
- Add horizontal scroll to columns. Add invariant function.

## v0.9.0 (2024-11-27)

- Upgrade lexical to v0.20.0
- Fix importDOM for Layout plugin
- Upgrade vite
- Upgrade storybook packages

## v0.8.18 (2024-11-02)

- Upgrade lexical to v0.19.0
- Disable table hover actions on read only mode.
- Do not show equation component while in read only mode.
- Table hover layout actions helper.
- Bug Fix: Disable image and inline focusing, adding caption and editing in read-only mode.
- Numerous bug fixes.

## v0.8.17 (2024-10-02)

- Upgrade lexical to v0.18.0
- Add row stripping.
- Add multiline element transformers.
- Fix excalidraw resizing.

## v0.8.16 (2024-08-27)

- Update lexical to version 0.17.1

## v0.8.14 (2024-06-06)

- Update lexical to version 0.17.0
- Add hover buttons to table (for adding columns and rows)
- Aesthetic fixes to table menu.

## v0.8.11 (2024-06-06)

- Update lexical to version 0.16.0
- Load image error UI.
- Refactor InlineImageNode (spans) for correct HTML.

## v0.8.10 (2024-05-14)

- Update lexical to version 0.15.0
- Update collapsible container logic.
- Add powershell to the list of supported languages.
- Actually apply styles to text that is inside the table.

## v0.8.9 (2024-05-01)

- Update packages
- Increase instagram node height.

## v0.8.8 (2024-04-27)

- Update react version.

## v.0.8.7 (2024-04-06)

- Update lexical to version 0.14.5.

## v.0.8.6 (2024-04-06)

- Update lexical to version 0.14.3 bringing in many bugfixes.
- Support for inserting instagram posts.

## v.0.8.5 (2024-03-23)

- Update lexical to version 0.14.2 bringing in many bugfixes.
   + ImportDOM and ExportDOM for LayoutContainerNode (#5722) Ivaylo Pavlov
   + Fix dont call importDOM methods more than once (#5726) Georgii Dolzhykov
   + Fix to count tabs as list indentation on importing markdown (#5706) wnhlee

- Update storybook

## v0.7.5 (2024-01-10)

 - Fix typescript types.

## v0.7.4 (2024-01-10)

 - Add typescript types.

## v0.7.0 (2024-01-09)

 - Update @lexical package to v0.12.6.
