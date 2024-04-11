import React from 'react';
import { Wrap, WrapItem, Box, Text } from '@chakra-ui/react';

const UserFavorites = ({ favorites }) => (
  <Wrap spacing="20px">
    {favorites.map((movie, index) => (
      <WrapItem key={index}>
        <Box p="4" borderWidth="1px" borderRadius="lg">
          <Text fontSize="lg" fontWeight="bold">{movie.title}</Text>
          <Text fontSize="md">{movie.year}</Text>
        </Box>
      </WrapItem>
    ))}
  </Wrap>
);

export default UserFavorites;
