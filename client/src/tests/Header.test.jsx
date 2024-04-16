import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Header from '../components/Header';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';

jest.mock('@auth0/auth0-react', () => ({
	useAuth0: jest.fn().mockReturnValue({
		isAuthenticated: false,
		user: null,
		loginWithRedirect: jest.fn(),
		logout: jest.fn(),
		isLoading: false,
	}),
}));

jest.mock('react-router-dom', () => ({
	useNavigate: jest.fn(),
}));

describe('Header Component', () => {
	const mockNavigate = jest.fn();
	const mockLoginWithRedirect = jest.fn();
	const mockLogout = jest.fn();

	beforeEach(() => {
		useNavigate.mockReturnValue(mockNavigate);
		useAuth0.mockReturnValue({
			isAuthenticated: false,
			user: null,
			loginWithRedirect: mockLoginWithRedirect,
			logout: mockLogout,
			isLoading: false,
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	test('renders correctly when not authenticated', () => {
		render(<Header />);
		expect(screen.getByText('CineFave')).toBeInTheDocument();
		expect(screen.getByText('Open movie review')).toBeInTheDocument();
		expect(screen.queryByText('Logout')).not.toBeInTheDocument(); // Assuming "Logout" text appears in LoginMenu when authenticated
	});

	test('navigates to home when logo or title is clicked', () => {
		render(<Header />);
		fireEvent.click(screen.getByAltText('Logo'));
		expect(mockNavigate).toHaveBeenCalledWith('/');

		fireEvent.click(screen.getByText('CineFave'));
		expect(mockNavigate).toHaveBeenCalledWith('/');
	});

	test('calls loginWithRedirect when login is triggered', () => {
		useAuth0.mockReturnValueOnce({
			...useAuth0(),
			isAuthenticated: false,
		});
		render(<Header />);
		const loginButton = screen.getByRole('button', { name: /login/i });
		fireEvent.click(loginButton);
		expect(mockLoginWithRedirect).toHaveBeenCalled();
	});

	test('renders user info when authenticated', () => {
		useAuth0.mockReturnValueOnce({
			isAuthenticated: true,
			user: { name: 'Jane Doe' },
			loginWithRedirect: jest.fn(),
			logout: mockLogout,
			isLoading: false,
		});
		render(<Header />);
		const avatarImage = screen.getByRole('img', { name: /avatar/i });
		expect(avatarImage).toBeInTheDocument();
	});

	test('renders user info when authenticated and can click show logout button ', async () => {
    useAuth0.mockReturnValueOnce({
			isAuthenticated: true,
			user: { name: 'Jane Doe' },
			loginWithRedirect: jest.fn(),
			logout: mockLogout,
			isLoading: false,
		});
    render(<Header />);
		const menuButton = screen.getByRole('button', { name: /avatar/i });
		fireEvent.click(menuButton);

		// Wait for the dropdown to become visible
		await waitFor(() => {
			expect(screen.getByRole('menu')).toBeVisible();
		});

		const logoutButton = screen.getByRole('menuitem', { name: /logout/i });
		expect(logoutButton).toBeInTheDocument();
		fireEvent.click(logoutButton);
		expect(mockLogout).toHaveBeenCalled();
	});
});
