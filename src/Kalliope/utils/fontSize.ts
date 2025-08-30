const MAX_ALLOWED_FONT_SIZE = 100;
const MIN_ALLOWED_FONT_SIZE = 1;

function parseFontSize(input: string): [number, string] | null {
    const match = input.match(/^(\d+(?:\.\d+)?)(px|pt)$/);
    return match ? [Number(match[1]), match[2]] : null;
  }
  
  function normalizeToPx(fontSize: number, unit: string): number {
    return unit === 'pt' ? Math.round((fontSize * 4) / 3) : fontSize;
  }
  
  function isValidFontSize(fontSizePx: number): boolean {
    return (
      fontSizePx >= MIN_ALLOWED_FONT_SIZE && fontSizePx <= MAX_ALLOWED_FONT_SIZE
    );
  }
  
  export function parseFontSizeForToolbar(input: string): string {
    const parsed = parseFontSize(input);
    if (!parsed) {
      return '';
    }
  
    const [fontSize, unit] = parsed;
    const fontSizePx = normalizeToPx(fontSize, unit);
    return `${fontSizePx}px`;
  }
  
  export function parseAllowedFontSize(input: string): string {
    const parsed = parseFontSize(input);
    if (!parsed) {
      return '';
    }
  
    const [fontSize, unit] = parsed;
    const fontSizePx = normalizeToPx(fontSize, unit);
    return isValidFontSize(fontSizePx) ? input : '';
  }