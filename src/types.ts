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
    dark: 'bg-[#0f172a]',
    mid: 'from-[#0f172a] via-[#1e3a8a] to-[#0f172a]',
    text: 'text-[#1e3a8a]',
  },
};
