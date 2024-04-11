import React from 'react';
import { Box, Avatar, Text, VStack } from '@chakra-ui/react';

const UserOverview = ({ userInfo }) => (
  <VStack>
    <Avatar name={userInfo?.nickname} src={userInfo?.picture} size="xl" />
    <Text fontSize="xl" fontWeight="bold">{userInfo.name}</Text>
    <Text fontSize="md">{userInfo.email}</Text>
    <Text fontSize="md">{userInfo.bio}</Text>
  </VStack>
);

export default UserOverview;
