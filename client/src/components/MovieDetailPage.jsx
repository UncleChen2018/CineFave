import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import GenreTags from './GenreTags';
import {
	Box,
	Flex,
	Image,
	Heading,
	HStack,
	Text,
	VStack,
	SimpleGrid,
	Divider,
	Link,
} from '@chakra-ui/react';


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
	const { id } = useParams();

	const [movie, setMovie] = useState(null); // State to hold the movie details

	useEffect(() => {
		const fetchMovieDetails = async () => {
      const baseUrl = process.env.REACT_APP_TMDB_BASE_URL;
				const apiKey = process.env.REACT_APP_TMDB_API_KEY;
				
			const endpoint = process.env.REACT_APP_TMDB_ENDPOINT_MOVIE_DETAILS;
			const url = `${baseUrl}${endpoint}/${id}?api_key=${apiKey}`; // Replace YOUR_API_KEY with your actual TMDB API key
    
			try {
				const response = await fetch(url);
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const data = await response.json();
				setMovie(data);
			} catch (error) {
				console.error('Fetching movie details failed:', error);
			}
		};

		fetchMovieDetails();
    console.log(movie);
	}, [id]); // The effect depends on the movie ID

	if (!movie) {
		return <Box>Loading...</Box>; // Loading state or a spinner can be placed here
	}

	const {
		title,
		overview,
		release_date,
		runtime,
		genres,
		poster_path,
		homepage,
		tagline,
		production_companies,
	} = movie;

	const runtimeHours = Math.floor(runtime / 60);
	const runtimeMinutes = runtime % 60;

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
						src={`https://image.tmdb.org/t/p/w342${poster_path}`}
						alt={`Poster of ${movie.title}`}
						borderRadius='lg'
					/>
				</Box>
				<VStack align='start' spacing={4}>
					<Heading as='h2' size='xl'>
						{title} ({new Date(release_date).getFullYear()}) {id}
					</Heading>
					{tagline && <Text fontStyle='italic'>"{tagline}"</Text>}
					<GenreTags genres={genres} />
					<Text fontSize='md' color='gray.600'>
						{release_date} • {runtimeHours}h {runtimeMinutes}m
					</Text>
					<Text fontSize='lg'>{overview}</Text>
					{homepage && (
						<Link href={homepage} isExternal>
							Official Website
						</Link>
					)}
					<HStack>
						{production_companies.map((company) => (
							<Text key={company.id} fontSize='sm'>
								{company.name}
							</Text>
						))}
					</HStack>
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


export default MovieDetailPage;
