import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders calculator title', () => {
  render(<App />);
  expect(screen.getByText(/React Calculator/i)).toBeInTheDocument();
});

test('performs addition correctly', () => {
  render(<App />);
  fireEvent.click(screen.getByText('1'));
  fireEvent.click(screen.getByText('+'));
  fireEvent.click(screen.getByText('2'));
  fireEvent.click(screen.getByText('='));
  expect(screen.getByRole('textbox').value).toBe('3');
});

test('clears input when C is pressed', () => {
  render(<App />);
  fireEvent.click(screen.getByText('7'));
  fireEvent.click(screen.getByText('C'));
  expect(screen.getByRole('textbox').value).toBe('');
});

test('shows error for invalid expression', () => {
  render(<App />);
  fireEvent.click(screen.getByText('1'));
  fireEvent.click(screen.getByText('+'));
  fireEvent.click(screen.getByText('+'));
  fireEvent.click(screen.getByText('='));
  expect(screen.getByRole('textbox').value).toBe('Error');
});
