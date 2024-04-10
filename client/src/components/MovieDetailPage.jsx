import React from 'react';
import { useParams } from 'react-router-dom';
import GenreTags from './GenreTags';
import {
	Box,
	Flex,
	Image,
	Heading,
	Text,
	VStack,
	SimpleGrid,
	Divider,
} from '@chakra-ui/react';

// Usage
const movie = {
	title: 'Kung Fu Panda 4',
	releaseYear: '2024',
	genres: [
		{
			id: 28,
			name: 'Action',
		},
		{
			id: 12,
			name: 'Adventure',
		},
		{
			id: 16,
			name: 'Animation',
		},
		{
			id: 35,
			name: 'Comedy',
		},
		{
			id: 10751,
			name: 'Family',
		},
	],
	duration: '1h 34m',
	imageUrl:
		'https://media.themoviedb.org/t/p/w300_and_h450_bestv2/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg',
	overview:
		'Po is gearing up to become the spiritual leader of his Valley of Peace...',
};

const reviews = [
	{
		id: 1,
		title: 'A review by Chris Sawin',
		content: "Kung Fu Panda 4 isn't the best Kung Fu Panda film...",
		// Add more review details as necessary
	},
	// More reviews...
];

function MovieDetailPage() {
	return (
		<Box mt='4' p='2'>
			{/* Movie Info and Image */}
			<SimpleGrid
				templateColumns={{ base: '1fr', md: 'auto 1fr' }}
				spacing={10}
			>
				<Box
					display='flex' // Enable Flexbox
					alignItems='center' // Vertically center the content
					justifyContent='center' // Horizontally center the content
					height='100%' // You might need to set a specific height
					width='100%' // You might need to set a specific width
					borderRadius='lg' // If you want the Box to have rounded corners
					overflow='hidden' // In case the Image is larger than the Box
				>
					<Image
						src={movie.imageUrl}
						alt={`Poster of ${movie.title}`}
						borderRadius='lg'
					/>
				</Box>
				<VStack align='start' spacing={4} p='4'>
					<Heading as='h2' size='xl'>
						{movie.title} ({movie.releaseYear})
					</Heading>
					<Text fontSize='lg' color='gray.600'>
						<GenreTags genres={movie.genres} />
						{movie.duration}
					</Text>
					<Text>{movie.overview}</Text>
					{/* Add more movie details here */}
				</VStack>
			</SimpleGrid>

			{/* Divider */}
			<Divider my={10} />

			{/* Review List */}
			<VStack align='start' spacing={8}>
				<Heading as='h3' size='lg'>
					Social
				</Heading>
				{reviews.map((review) => (
					<Box
						key={review.id}
						p={5}
						shadow='md'
						borderWidth='1px'
						borderRadius='lg'
						w='full'
					>
						<Heading as='h4' size='md'>
							{review.title}
						</Heading>
						<Text mt={2}>{review.content}</Text>
						{/* Add more review details here */}
					</Box>
				))}
			</VStack>
		</Box>
	);
}

function App() {
	return (
		<Box p={8}>
			<MovieDetailPage movie={movie} reviews={reviews} />
		</Box>
	);
}

export default MovieDetailPage;
