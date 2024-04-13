import React from 'react';
import { Wrap, WrapItem, Box, Text } from '@chakra-ui/react';
import MovieCard from './MovieCard';

const UserFavorites = ({ favorites }) => (
  <Wrap spacing="20px">
    {favorites.map((item, index) => (
      <WrapItem key={index}>
        <Box p="4" borderWidth="1px" borderRadius="lg">
          
          <Text fontSize="lg" fontWeight="bold">{item.movieId}</Text>
          <Text fontSize="md">{new Date(item.createTime).toLocaleDateString()}</Text>
        </Box>
      </WrapItem>
    ))}
  </Wrap>
);

export default UserFavorites;
