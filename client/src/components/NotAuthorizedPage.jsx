import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Heading, Text, Button } from '@chakra-ui/react';
import { useAuth0 } from '@auth0/auth0-react';

export default function NotAuthorizedPage() {
  const { loginWithRedirect } = useAuth0();

  return (
    <Box textAlign="center" py={10} px={6}>
      <Heading
        display="inline-block"
        as="h2"
        size="xl"
        bgGradient="linear(to-r, red.400, red.600)"
        backgroundClip="text">
        401
      </Heading>
      <Text fontSize="18px" mt={3} mb={2}>
        Not Authorized
      </Text>
      <Text color={'gray.500'} mb={6}>
        Sorry, you cannot visit this page because you're not logged in.
      </Text>

      <Button
        colorScheme="red"
        bgGradient="linear(to-r, red.400, red.500, red.600)"
        color="white"
        variant="solid"
        onClick={() => loginWithRedirect()}>
        Log In
      </Button>
      <Text mt={4}>or</Text>
      <Button
        mt={2}
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
