import {
	Heading,
	Box,
	Flex,
	Text,
	Button,
	Image,
	useColorModeValue,
	Container,
	useBreakpointValue,
} from '@chakra-ui/react';
import { FiUser } from 'react-icons/fi'; // Make sure to import the icon from 'react-icons/fi'

import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import ProfileMenu from './ProfileMenu';

export function Home() {
	const navigate = useNavigate();
	const { isAuthenticated, loginWithRedirect, user } = useAuth0();
	const signUp = () => loginWithRedirect({ screen_hint: 'signup' });

	return (
		<div className='home'>
			<h1>TODOs App</h1>
			<div>
				{!isAuthenticated ? (
					<button className='btn-primary' onClick={loginWithRedirect}>
						Login
					</button>
				) : (
					<button className='btn-primary' onClick={() => navigate('/app')}>
						Enter App
					</button>
				)}
			</div>
			<div>
				<button className='btn-secondary' onClick={signUp}>
					Create Account
				</button>
			</div>
		</div>
	);
}

export default function Header() {
	const navigate = useNavigate();
	const { isAuthenticated, loginWithRedirect, user, isLoading, logout } =
		useAuth0();

	const handleClickProfile = () => {
		if (isAuthenticated) {
			navigate('/app');
		} else {
			loginWithRedirect({ screen_hint: 'signup' });
		}
	};
	

	const bg = useColorModeValue('blue.500', 'blue.800'); // Light mode: blue.500, dark mode: blue.800
	const color = useColorModeValue('white', 'gray.200'); // Light mode: white text, dark mode: slightly darker text
	const isMobile = useBreakpointValue({ base: true, md: false }); // If the screen is smaller than 48em, isMobile is true
	return (
		<Container maxW='1280px' w='100%' mx='auto' px={0}>
			<Flex
				alignItems='center'
				justifyContent='space-between'
				p='4'
				bg='blue.500'
				color='white'
			>
				<Box flex='1' ml='60px'>
					<Image src='cat_logo.webp' alt='Logo' h='60px' w='auto' />
				</Box>
				<Box flex='2' textAlign='center'>
					<Heading as='h1' size='xl'>
						CineFave
					</Heading>
					<Text fontSize='md' mt={2} fontWeight='light' letterSpacing='wide'>
						Open movie review
					</Text>
				</Box>
				<Box flex='1' textAlign='right' mr='60px'>
					<ProfileMenu isAuthenticated={isAuthenticated} user={user} login={loginWithRedirect} logout={logout}/>
				</Box>
			</Flex>
		</Container>
	);
}
