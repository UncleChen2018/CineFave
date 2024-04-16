import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchBar from '../components/SearchBar';
import { useNavigate } from 'react-router-dom';



jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));
// Mock useNavigate
const mockedNavigate = jest.fn();

describe('SearchBar Component', () => {
  beforeEach(() => {
    
    
    useNavigate.mockReturnValue(mockedNavigate);
  });

  afterEach(() => {
    jest.clearAllMocks();  // Resets Jest mock functions like `mockedNavigate`.
  });

  test('updates input field as user types', () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText('Search for a movie...');
    fireEvent.change(input, { target: { value: 'Star Wars' } });
    expect(input.value).toBe('Star Wars');
  });

  test('navigates to search page with query when search button is clicked', () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText('Search for a movie...');
    const button = screen.getByRole('button', { name: 'Search' });

    fireEvent.change(input, { target: { value: 'Star Wars' } });
    fireEvent.click(button);

    expect(mockedNavigate).toHaveBeenCalledWith('/search?query=Star%20Wars');
  });

  test('navigates to search page with query when Enter key is pressed', () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText('Search for a movie...');
    fireEvent.change(input, { target: { value: 'Star Wars' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(mockedNavigate).toHaveBeenCalledWith('/search?query=Star%20Wars');
});


  test('does not navigate if search term is empty', () => {
    render(<SearchBar />);
    const button = screen.getByRole('button', { name: 'Search' });
    fireEvent.click(button);

    expect(mockedNavigate).not.toHaveBeenCalled();
  });
});
