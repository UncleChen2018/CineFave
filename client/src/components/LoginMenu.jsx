import React from 'react';
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
import { FiUser } from 'react-icons/fi'; // Import the icon

const LoginMenu = ({ isAuthenticated, user, login, logout }) => {
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
							<MenuItem>View Profile</MenuItem>
							<MenuItem>Discussions</MenuItem>
							<MenuItem>Lists</MenuItem>
							<MenuItem>Ratings</MenuItem>
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
