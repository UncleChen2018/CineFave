import React from 'react';
import { useNavigate } from 'react-router-dom';


import {
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	MenuGroup,
	MenuDivider,
	Button,
	Avatar,
} from '@chakra-ui/react';

const LoginMenu = ({ isAuthenticated, user, login, logout }) => {
	const navigate = useNavigate();
	return (
		<Menu>
			{isAuthenticated ? (
				<>
					<MenuButton as={Button} colorScheme='blue' h='60px' w='auto'>
						<Avatar name={user?.nickname} src={user?.picture} />
					</MenuButton>

					<MenuList color='black' fontSize='sm'>
						<MenuGroup
							title={user?.nickname}
							fontWeight='bold'
							fontSize='lg'
							color='blue.600'
						>
							<MenuDivider />
							<MenuItem onClick={() => navigate('/profile')}>
								View Profile
							</MenuItem>
							<MenuItem>Edit Profile</MenuItem>
							<MenuItem onClick={() => navigate('/profile/auth_debugger')}>AuthDebugger</MenuItem>
						</MenuGroup>
						<MenuDivider />
						<MenuGroup>
							<MenuItem
								onClick={() => logout({ returnTo: window.location.origin })}
							>
								Logout
							</MenuItem>
						</MenuGroup>
					</MenuList>
				</>
			) : (
				<Button colorScheme='blue' h='60px' w='auto' onClick={login}>
					Login
				</Button>
			)}
		</Menu>
	);
};

export default LoginMenu;
