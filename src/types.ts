/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AppTheme {
  dark: string;
  mid: string;
  text: string;
}

export const themes: Record<string, AppTheme> = {
  green: {
    dark: 'bg-[#022c22]',
    mid: 'from-[#022c22] via-[#064e3b] to-[#022c22]',
    text: 'text-[#064e3b]',
  },
  navy: {
    dark: 'bg-[#020617]',
    mid: 'from-[#020617] via-[#1e1b4b] to-[#020617]',
    text: 'text-[#1e1b4b]',
  },
  romantic: {
    dark: 'bg-[#1c1917]',
    mid: 'from-[#1c1917] via-[#44403c] to-[#1c1917]',
    text: 'text-[#44403c]',
  },
};
