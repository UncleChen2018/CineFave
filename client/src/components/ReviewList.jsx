import React, { useState, useRef, useEffect } from 'react';
import {
	Box,
	VStack,
	Heading,
	HStack,
	Image,
	Text,
	Tag,
	TagLabel,
	TagLeftIcon,
	Button,
	Stack,
} from '@chakra-ui/react';
import { FaStar } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import CollapsibleMarkdown from './CollapsibleMarkdown';

function ReviewList({ title, reviews, handleDelete }) {
	const handleEdit = (reviewId) => {
		// Logic to handle editing a review
	};


	if (!reviews || reviews.length === 0) {
		return (
			<VStack align='start' spacing={8} my={10}>
				<Heading as='h3' size='lg'>
					{title}
				</Heading>
				<Text px='4'>No reviews available.</Text>
			</VStack>
		);
	}

	return (
		<VStack align='start' spacing={8}>
  <Heading as='h3' size='lg' width='full'>
    {title}
  </Heading>
  {reviews.map((review) => (
    <Box key={review.id} p={5} shadow='md' borderWidth='1px' width='full'>
      <VStack align='start' spacing={2}>
        <HStack spacing={4} align='center' width='full'>
          {review.author_details.avatar_path ? (
            <Image
              borderRadius='full'
              boxSize='50px'
              src={review.author_details.avatar_path}
              alt={`Avatar of ${review.author}`}
            />
          ) : (
            <Box borderRadius='full' boxSize='50px' bg='gray.200' />
          )}
          <VStack align='start'>
            <Text fontWeight='bold'>
              {review.title || `Review from ${review.author}`}
            </Text>
            <HStack>
              {review.author_details.rating && (
                <Tag colorScheme='blackAlpha' borderRadius='full'>
                  <TagLeftIcon boxSize='12px' as={FaStar} />
                  <TagLabel>{review.author_details.rating * 10}%</TagLabel>
                </Tag>
              )}
              <Text fontSize='sm'>
                By {review.author_details.username || 'Anonymous'}
              </Text>
            </HStack>
          </VStack>
        </HStack>
        <Text fontSize='sm'>
          Written on{' '}
					{formatDate(review.created_at)}
          {review.updated_at !== review.created_at &&
						` (Updated on ${formatDate(review.updated_at)})`
					}
        </Text>
      </VStack>
      <CollapsibleMarkdown content={review.content} maxHeight='100px' />
      {/* Add more review details here */}
      {review.isAuthor && (
        <HStack spacing={4} mt={2}>
          <Button size='sm' onClick={() => handleEdit(review.id)}>
            Edit
          </Button>
          <Button
            size='sm'
            colorScheme='red'
            onClick={() => handleDelete(review.id)}
          >
            Delete
          </Button>
        </HStack>
      )}
    </Box>
  ))}
</VStack>
	);
}


function formatDate(dateString) {
	return new Date(dateString).toLocaleString(undefined, {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
	});
}


export default ReviewList;
