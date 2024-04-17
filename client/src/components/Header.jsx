import { Heading, Box, Flex, Text, Image } from '@chakra-ui/react';

import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import LoginMenu from './LoginMenu';

export default function Header() {
	const navigate = useNavigate();
	const { isAuthenticated, loginWithRedirect, user, logout } =
		useAuth0();

	const handleLogin = () => {
		// Save the current page in local storage
		const path = window.location.pathname;
		const excludedPaths = ['/not-authorized'];
		if (!excludedPaths.includes(path)) {
			localStorage.setItem('lastPage', window.location.href);
		}

		// Redirect to login
		loginWithRedirect();
	};

	const handleLogout = () => {
		localStorage.removeItem('userProfile');
		localStorage.removeItem('favorites');
		localStorage.removeItem('lastPage');
		logout({ returnTo: window.location.origin });
	};

	return (
		<Flex
			alignItems='center'
			justifyContent='space-between'
			p='4'
			bg='blue.500'
			color='white'
		>
			<Box flex='1' ml={{ base: '0', sm: '20px', md: '40px', lg: '60px' }}>
				<Image
					src='/cat_logo.webp'
					alt='Logo'
					h='60px'
					w='auto'
					cursor='pointer'
					onClick={() => {
						navigate('/'); // Navigate to the home page
					}}
				/>
			</Box>
			<Box
				flex='2'
				textAlign='center'
				cursor='pointer'
				onClick={() => {
					navigate('/'); // Navigate to the home page
				}}
			>
				<Heading as='h1' size='xl'>
					CineFave
				</Heading>
				<Text fontSize='md' mt={2} fontWeight='light' letterSpacing='wide'>
					Open movie review
				</Text>
			</Box>
			<Box
				flex='1'
				textAlign='right'
				mr={{ base: '0', sm: '20px', md: '40px', lg: '60px' }}
			>
				<LoginMenu
					isAuthenticated={isAuthenticated}
					user={user}
					login={handleLogin}
					logout={handleLogout}
				/>
			</Box>
		</Flex>
	);
}
