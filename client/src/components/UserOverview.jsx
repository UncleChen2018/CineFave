import React from 'react';
import { Button, Box, Flex, Avatar, Text, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import CollapsibleMarkdown from './CollapsibleMarkdown';

function UserOverview({ userInfo }) {
  const navigate = useNavigate();

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
          name={userInfo?.nickname || userInfo?.name}
          src={userInfo?.picture}
          size={{ base: 'lg', md: 'xl' }} // Smaller avatar on smaller screens
          marginBottom={{ base: 4, md: 0 }} // Add margin-bottom on smaller screens
        />
        <VStack align={{ base: 'center', md: 'start' }} spacing={3}>
          <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold" textAlign={{ base: 'center', md: 'left' }}>
            {userInfo.nickname || userInfo.name}
          </Text>
          <Text fontSize={{ base: 'md', md: 'lg' }}>{userInfo.email}</Text>
          <Text fontSize="md">Member since: {new Date(userInfo.create_time).toLocaleDateString()}</Text>
        </VStack>
      </Flex>

      {/* Bio Section */}
			<Box bg="gray.50" p={4}>
			<Text fontSize="xl" mb={2}>Bio:</Text>
			<CollapsibleMarkdown content={userInfo.bio || 'A Mysterious Member'} maxHeight='200px' />

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
