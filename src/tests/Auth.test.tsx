// apps/mobile/src/tests/Auth.test.tsx
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '@/app/(auth)/login';

describe('Login Screen', () => {
  it('renders correctly', () => {
    const { getByText, getByPlaceholderText } = render(<LoginScreen />);
    
    expect(getByText('مرحباً بك في Orient')).toBeTruthy();
    expect(getByPlaceholderText('example@email.com')).toBeTruthy();
    expect(getByPlaceholderText('••••••••')).toBeTruthy();
  });

  it('shows error when fields are empty', async () => {
    const { getByText, queryByText } = render(<LoginScreen />);
    
    const loginButton = getByText('تسجيل الدخول');
    fireEvent.press(loginButton);
    
    await waitFor(() => {
      expect(queryByText(/يرجى ملء جميع الحقول/)).toBeTruthy();
    });
  });
});