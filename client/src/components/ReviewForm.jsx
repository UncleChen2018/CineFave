import React, { useState } from 'react';
import {
	VStack,
	Text,
	Input,
	Button,
	Flex,
	useToast,
	Box,
} from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import MarkdownEditor from './MarkdownEditor';
import useAddReview from '../hooks/useAddReview'; // Replace with the actual hook for adding a review

// A simple star rating component

const maxRating = 5;
// Rating descriptions object
const ratingDescriptions = {
	1: '20% - Poor',
	2: '40% - Fair',
	3: '60% - Good',
	4: '80% - Very Good',
	5: '100% - Excellent',
};

const Rating = ({
	rating,
	setRating,
	ratingDescription,
	setRatingDescription,
}) => {
	// Update the rating and its description
	const handleRating = (index) => {
		const newRating = index + 1;
		setRating(newRating);
		setRatingDescription(ratingDescriptions[newRating]);
	};

	return (
		<Box display='flex' alignItems='center' mb={3}>
			{[...Array(maxRating)].map((_, index) => (
				<StarIcon
					key={index}
					onClick={() => handleRating(index)}
					cursor='pointer'
					color={index < rating ? 'gold' : 'gray.300'}
				/>
			))}
			<Text ml={3}>{ratingDescription}</Text>
		</Box>
	);
};

const ReviewForm = ({ movieId, onClose, onSuccess }) => {
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');

	const [rating, setRating] = useState(3); // 5 star rating system
	const [ratingDescription, setRatingDescription] = useState(
		ratingDescriptions[rating]
	);

	const { addReview, isSubmitting, error } = useAddReview();
	const toast = useToast();

	const handleSubmit = async () => {
		if (!content.trim()) {
			toast({
				title: 'Error',
				description: "Content can't be empty",
				status: 'error',
				duration: 5000,
				isClosable: true,
			});
			return;
		}

		const ratingScore = rating / maxRating;
    //success message
		const result = await addReview(movieId, {
			title,
			content,
			rating: ratingScore,
		});
		if (result) {
			setTitle('');
			setContent('');
			setRating(3);
			setRatingDescription(ratingDescriptions[3]);
			toast({
				title: 'Review Submitted',
				description: 'Your review has been added successfully.',
				status: 'success',
				duration: 5000,
				isClosable: true,
			});
      onClose();
			onSuccess();
		}
	};

	return (
		<VStack spacing={4} align='stretch' mt='10'>
			<Text fontWeight='semibold'>Title of your review:</Text>
			<Input
				placeholder='Enter the title of your review'
				value={title}
				onChange={(e) => setTitle(e.target.value)}
			/>

			<Text fontWeight='semibold'>Your rating:</Text>
			<Rating
				rating={rating}
				setRating={setRating}
				ratingDescription={ratingDescription}
				setRatingDescription={setRatingDescription}
			/>

			<Text fontWeight='semibold'>
				Review content:{' '}
				<Text as='span' color='red.500'>
					*
				</Text>
			</Text>
			<MarkdownEditor
				initialText={content}
				onChange={setContent}
				placeholder='Write your review here...'
			/>

			<Flex justifyContent='flex-end'>
				<Button
					colorScheme='blue'
					isLoading={isSubmitting}
					onClick={handleSubmit}
					isDisabled={!content.trim()} // Disable button if content is empty
				>
					Submit Review
				</Button>
				<Button colorScheme='red' onClick={onClose}>
					Cancel
				</Button>
			</Flex>
			{error && <Text color='red.500'>Error: {error}</Text>}
		</VStack>
	);
};

export default ReviewForm;
