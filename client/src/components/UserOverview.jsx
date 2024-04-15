import React from 'react';
import { Button, Box, Flex, Avatar, Text, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import CollapsibleMarkdown from './CollapsibleMarkdown';
import { useUserInfo } from '../UserInfoContext';

function UserOverview() {
  const navigate = useNavigate();
  const { userProfile, setUserProfile, favorites,isLoading } = useUserInfo();
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <Box>
      {/* Header with user info */}
      <Flex
        direction={{ base: 'column', md: 'row' }} // Stack vertically on smaller screens
        bgGradient="linear(to-r, teal.500, green.500)"
        color="white"
        p={{ base: 4, md: 6 }}
        alignItems="center"
        justifyContent={{ md: 'space-between' }}
      >
        <Avatar
          name={userProfile?.nickname || userProfile?.name}
          src={userProfile?.picture}
          size={{ base: 'lg', md: 'xl' }} // Smaller avatar on smaller screens
          marginBottom={{ base: 4, md: 0 }} // Add margin-bottom on smaller screens
        />
        <VStack align={{ base: 'center', md: 'start' }} spacing={3}>
          <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold" textAlign={{ base: 'center', md: 'left' }}>
            {userProfile.nickname || userProfile.name}
          </Text>
          <Text fontSize={{ base: 'md', md: 'lg' }}>{userProfile.email}</Text>
          <Text fontSize="md">Member since: {new Date(userProfile.createTime).toLocaleDateString()}</Text>
        </VStack>
      </Flex>

      {/* Bio Section */}
			<Box bg="gray.50" p={4}>
			<Text fontSize="xl" mb={2}>Bio:</Text>
			<CollapsibleMarkdown content={userProfile.bio || 'A Mysterious Member'} maxHeight='200px' />

      </Box>

      {/* Edit Profile Button */}
      <Flex justifyContent={{ base: 'center', md: 'flex-end' }} p={4}>
        <Button
          colorScheme="orange"
          onClick={() => navigate('edit', { replace: true })}
        >
          Edit Profile
        </Button>
      </Flex>
    </Box>
  );
}

export default UserOverview;
