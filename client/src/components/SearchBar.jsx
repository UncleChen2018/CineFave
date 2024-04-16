// SearchBar component
import React, { useState } from 'react';
import { Input, Button, Flex } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({value=''}) => {
  const [searchTerm, setSearchTerm] = useState(value);
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchTerm.trim()) {
      // Navigate to the search page with the query parameter
      navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <Flex mb={4}>
      <Input
        placeholder="Search for a movie..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
      />
      <Button onClick={handleSearch} ml={2}>
        Search
      </Button>
    </Flex>
  );
};

export default SearchBar;
