import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Heading, Text, Button } from '@chakra-ui/react';

export default function NotFoundPage () {
  return (
    <Box textAlign="center" py={10} px={6}>
    <Heading
      display="inline-block"
      as="h1"
      size="2xl"
      bgGradient="linear(to-r, blue.400, blue.600)"
      backgroundClip="text">
      404
    </Heading>
    <Text fontSize="18px" mt={3} mb={2}>
      Not Found!
    </Text>
    <Text color={'gray.500'} mb={6}>
      Sorry, the page you are looking for does not exist.
    </Text>

    <Button
      colorScheme="blue"
      bgGradient="linear(to-r, blue.400, blue.500, blue.600)"
      color="white"
      variant="solid"
      as={Link}
      to="/">
      Go to the Homepage
    </Button>
  </Box>
);

}
