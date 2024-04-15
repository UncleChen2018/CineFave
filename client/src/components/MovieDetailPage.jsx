import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@chakra-ui/react';

import MovieDetailCard from './MovieDetailCard';
import ReviewList from './ReviewList';
import ReviewForm from './ReviewForm';

import { Box, Divider } from '@chakra-ui/react';

function MovieDetailPage() {
	const { id } = useParams();

	const [movie, setMovie] = useState(null); // State to hold the movie details
	const [showReviewForm, setShowReviewForm] = useState(false);

	// Fetch movie details, also put the reviews into it
	useEffect(() => {
		const fetchMovieData = async () => {
			const baseUrl = process.env.REACT_APP_TMDB_BASE_URL;
			const apiKey = process.env.REACT_APP_TMDB_API_KEY;
			const detailsEndpoint = process.env.REACT_APP_TMDB_ENDPOINT_MOVIE_DETAILS;
			const reviewsEndpoint = `${process.env.REACT_APP_TMDB_ENDPOINT_MOVIE_DETAILS}/${id}/reviews`;

			try {
				// Fetch Movie Details
				const detailsUrl = `${baseUrl}${detailsEndpoint}/${id}?api_key=${apiKey}`;
				const detailsResponse = await fetch(detailsUrl);
				if (!detailsResponse.ok) {
					throw new Error(`HTTP error! status: ${detailsResponse.status}`);
				}
				const detailsData = await detailsResponse.json();

				// Fetch Movie Reviews
				const reviewsUrl = `${baseUrl}${reviewsEndpoint}?api_key=${apiKey}`;
				const reviewsResponse = await fetch(reviewsUrl);
				if (!reviewsResponse.ok) {
					throw new Error(`HTTP error! status: ${reviewsResponse.status}`);
				}
				const reviewsData = await reviewsResponse.json();

				// Set movie details and reviews in the state
				setMovie({
					...detailsData,
					imageUrl: `${process.env.REACT_APP_TMDB_IMG_HOST_URL}${process.env.REACT_APP_TMDB_IMAGE_SIZE}${detailsData.poster_path}`,
					releaseDate: detailsData.release_date,
					reviews: reviewsData.results,
				});
			} catch (error) {
				console.error('Fetching movie data failed:', error);
			}
		};

		fetchMovieData(); // Ensure id is not undefined or null
		//console.log(movie)
	}, [id]); // Effect runs when the 'id' changes

	if (!movie) {
		return <Box>Loading...</Box>; // Loading state or a spinner can be placed here
	}

	// Function to handle the closing of the review form
	const toggleReviewForm = () => {
		setShowReviewForm(!showReviewForm);
	};

	return (
		<Box mt='4' p='2'>
			{/* Movie Info and Image */}
			<MovieDetailCard movie={movie} />
			{/* Divider */}
			<Divider my={10} />
			{/*Button's to publish new review */}
			<Button colorScheme='blue' onClick={toggleReviewForm}>
				{showReviewForm ? 'Fold Review Form' : 'Publish My Review'}
			</Button>

			{/* Conditionally render the ReviewForm based on showReviewForm state */}
			{showReviewForm && (
				<ReviewForm movieId={movie.id} onClose={toggleReviewForm} />
			)}
			<ReviewList reviews={null} title={'Reviews from CineFav'} />

			<Divider my={10} />
			<ReviewList reviews={movie.reviews} title={'Reviews from TMDB'} />
		</Box>
	);
}

export default MovieDetailPage;
