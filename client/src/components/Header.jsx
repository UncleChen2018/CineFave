import { Box,Flex, Text, Button, Image, useColorModeValue } from '@chakra-ui/react';
import { FiUser } from 'react-icons/fi'; // Make sure to import the icon from 'react-icons/fi'

export default function Header() {
	const bg = useColorModeValue('blue.500', 'blue.800'); // Light mode: blue.500, dark mode: blue.800
	const color = useColorModeValue('white', 'gray.200'); // Light mode: white text, dark mode: slightly darker text
	return (
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
        <Text fontSize="xl" fontWeight="bold">CineFave</Text>
      </Box>
      <Box flex="1" textAlign="right" mr="20px">
        <Button colorScheme="blue" leftIcon={<FiUser />}>Profile</Button>
      </Box>
    </Flex>
	);
}
