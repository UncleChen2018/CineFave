import React from 'react';
import { Button, Box, Flex, Avatar, Text, Textarea } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

function UserOverview({ userInfo }) {
	const navigate = useNavigate();
  
	return (
		<>
			<Flex
				direction={{ base: 'column', md: 'row' }} // Stack vertically on small screens, horizontal on medium and up
				justifyContent='center'
				minW='80%'
				w='100%'
				h='full'
				wrap='wrap'
				gap={{ base: 5, md: 0 }} // Add some gap between items when stacked
				px='5%'
			>
				{/* Left Side - User Information */}
				<Box w={{ base: '100%', md: '30%' }} minW='240px' pr={{ md: 4 }}>
					<Flex direction='column' gap={2} align='start'>
						<Box>
							<Text fontSize='md' color='gray.500'>
								Avatar:
							</Text>
							<Avatar
								name={userInfo?.nickname || userInfo?.name}
								src={userInfo?.picture}
								size='md'
							/>
						</Box>
						<Box>
							<Text fontSize='md' color='gray.500'>
								Email:
							</Text>
							<Text fontSize='lg'>{userInfo.email}</Text>
						</Box>
						<Box>
							<Text fontSize='md' color='gray.500'>
								Nickname:
							</Text>
							<Text fontSize='lg' fontWeight='bold'>
								{userInfo.nickname || userInfo.name}
							</Text>
						</Box>
					</Flex>
				</Box>

				{/* Right Side - Bio */}
				<Box flex={{ base: '1', md: '1' }} minW='240px'>
					<Text fontSize='md' color='gray.500'>
						Bio:
					</Text>
					<Textarea
						value={userInfo.bio || 'A Mysterious Member'}
						isReadOnly
						placeholder='No bio available'
						variant='filled'
						resize='none'
						h={{ base: 'auto', md: '100%' }} // Auto height on base, full height on md and up
						overflow='auto'
					/>
				</Box>
			</Flex>
			<Button
				mt={4}
				colorScheme='blue'
				onClick={() => navigate('edit', { replace: true})}
			>
				Edit Profile
			</Button>
		</>
	);
}

export default UserOverview;
