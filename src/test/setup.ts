import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock scrollTo
window.scrollTo = vi.fn();

// Mock IntersectionObserver
window.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
