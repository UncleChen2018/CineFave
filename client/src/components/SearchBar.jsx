import React, { useState } from 'react';
import { Input, Button, Flex } from '@chakra-ui/react';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  return (
    <Flex mb={4}>
      <Input
        placeholder="Search for a movie..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
      />
      <Button onClick={handleSearch} ml={2}>
        Search
      </Button>
    </Flex>
  );
};

export default SearchBar;
