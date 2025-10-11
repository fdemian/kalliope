export function parseAllowedColor(input: string) {
    return /^rgb\(\d+, \d+, \d+\)$/.test(input) ? input : '';
  }