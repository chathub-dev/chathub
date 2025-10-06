import { vi, expect } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

vi.mock('webextension-polyfill', () => {
  return {
    default: {
      runtime: {
        getURL: (path) => path,
      },
      i18n: {
        getMessage: (message) => message,
      },
    },
  };
});