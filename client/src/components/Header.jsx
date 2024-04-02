import { Heading, Box,Flex, Text, Button, Image, useColorModeValue, Container, useBreakpointValue } from '@chakra-ui/react';
import { FiUser } from 'react-icons/fi'; // Make sure to import the icon from 'react-icons/fi'

export default function Header() {
	const bg = useColorModeValue('blue.500', 'blue.800'); // Light mode: blue.500, dark mode: blue.800
	const color = useColorModeValue('white', 'gray.200'); // Light mode: white text, dark mode: slightly darker text
  const isMobile = useBreakpointValue({ base: true, md: false }); // If the screen is smaller than 48em, isMobile is true
	return (
    <Container maxW="1280px" w="100%" mx="auto" px={0}>
		<Flex
      alignItems="center"
      justifyContent="space-between" 
      p="4"
      bg="blue.500"
      color="white"

    >
      <Box flex="1" ml="20px">
        <Image src="cat_logo.webp" alt="Logo" h="60px" w="auto" />
      </Box>
      <Box flex="2" textAlign="center"> 
      <Heading as="h1" size="xl" >
    CineFave
  </Heading>
  <Text fontSize="md" mt={2} fontWeight="light" letterSpacing="wide">
    Open movie review
  </Text>
      </Box>
      <Box flex="1" textAlign="right" mr="20px">
        <Button colorScheme="blue" h="60px" w="auto" leftIcon={<FiUser  size="1.5em" />}>
          {isMobile ? null : "Profile"}
        </Button>
      </Box>
    </Flex>
    </Container>
	);
}
