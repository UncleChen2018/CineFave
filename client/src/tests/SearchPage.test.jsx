import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchPage from '../components/SearchPage';
import { BrowserRouter } from 'react-router-dom';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUserInfo } from '../UserInfoContext';
import useToggleFavorite  from '../hooks/useToggleFavorite';

jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useSearchParams: jest.fn(),
	useNavigate: jest.fn(),
}));

jest.mock('../UserInfoContext', () => ({
	useUserInfo: jest.fn(),
}));


jest.mock('../hooks/useToggleFavorite', () => ({
  __esModule: true, // This tells Jest to treat this as an ES module
  default: jest.fn() // This mocks the default export
}));


global.fetch = jest.fn();

describe('SearchPage Component', () => {
	beforeEach(() => {
    useNavigate.mockReturnValue(jest.fn());

		useUserInfo.mockReturnValue({
			favorites: [],
			isLoading: false,
			userProfile: {}, // Add other properties as needed for your component to render properly
		});
    useToggleFavorite.mockReturnValue({
      toggleFavorite: jest.fn() // Assuming toggleFavorite is a function returned by the hook
  });

		useSearchParams.mockReturnValue([
			{ get: jest.fn().mockReturnValue('star wars') },
			jest.fn(),
		]);
		fetch.mockResolvedValue({
			ok: true,
			json: () =>
				Promise.resolve({
					results: [
						{
							id: 1,
							poster_path: '/path.jpg',
							title: 'Star Wars',
							release_date: '1977-05-25',
						},
					],
				}),
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	test('renders and initiates a search if search term is present', async () => {
		render(
			<BrowserRouter>
				<SearchPage />
			</BrowserRouter>
		);

		expect(screen.getByText('Loading...')).toBeInTheDocument();
		await waitFor(() => screen.getByText('Star Wars'));
		expect(screen.getByText('Star Wars')).toBeInTheDocument();
	});


});
