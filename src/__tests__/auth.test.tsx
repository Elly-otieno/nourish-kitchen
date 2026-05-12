import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import React from 'react';

// Mock the API
vi.mock('../services/api', () => ({
  api: {
    login: vi.fn(),
    register: vi.fn(),
  },
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should start as unauthenticated', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.user).toBeNull();
  });

  it('should login successfully', async () => {
    const mockUser = { id: '1', name: 'James', email: 'james@example.com', role: 'USER' };
    (api.login as any).mockResolvedValue({ user: mockUser, token: 'fake-token' });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login('james@example.com');
    });

    expect(result.current.user).toEqual(mockUser);
    expect(localStorage.getItem('user')).toBeTruthy();
  });

  it('should logout and clear state', async () => {
    localStorage.setItem('user', JSON.stringify({ id: '1', name: 'James' }));
    localStorage.setItem('token', 'fake-token');

    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });
});
