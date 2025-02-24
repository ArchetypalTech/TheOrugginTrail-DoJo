import { writable } from 'svelte/store';
export type FormatType = 'input' | 'hash' | 'error' | 'out' | 'shog' ;

export type TerminalContentItem = {
  text: string;
  format: FormatType;
  useTypewriter?: boolean;
};

export const terminalContent = writable<TerminalContentItem[]>([]);

export function addTerminalContent(item: TerminalContentItem): Promise<void> {
  return new Promise<void>((resolve) => {
    terminalContent.update(content => [...content, item]);

    if (item.useTypewriter) {
      // Simulate the typewriter effect with a delay based on item.text length
      const typewriterDelay = item.text.length * 50; // Adjust delay

      setTimeout(() => {
        console.log(`Finished adding: ${item.text}`);
        resolve(); // Resolve when done
      }, typewriterDelay);
    } else {
      resolve(); // Immediately resolve if no typewriter effect
    }
  });
  // -- OLD WAY -- //
  //terminalContent.update(content => [...content, item]);
}

export function clearTerminalContent() {
  terminalContent.set([]);
}