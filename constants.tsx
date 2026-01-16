
import React from 'react';

// Removed Q (index 16) and X (index 23)
export const ALPHABET = "ABCDEFGHIKLMNOPRSTUVWYZ".split(""); 
// Note: The above string is 23 chars. Let's be explicit to ensure exactly 24 unique letters.
export const GAME_LETTERS = "ABCDEFGHIJ KLMNOP RSTUVW YZ".replace(/\s/g, "").split(""); 

export const GRID_SIZE = 5;

export const THEME = {
  primary: 'indigo-600',
  secondary: 'violet-600',
  accent: 'emerald-500',
};
