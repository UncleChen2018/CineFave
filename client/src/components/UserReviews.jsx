import React from 'react';
import { Box, Text, VStack } from '@chakra-ui/react';

const UserReviews = ({ reviews }) => (
  <VStack align="stretch">
    {reviews.map((review, index) => (
      <Box key={index} p="4" borderWidth="1px" borderRadius="lg">
        <Text fontSize="lg" fontWeight="bold">{review.movieTitle}</Text>
        <Text fontSize="md">{review.reviewText}</Text>
      </Box>
    ))}
  </VStack>
);

export default UserReviews;
