import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@chakra-ui/react';

import MovieDetailCard from './MovieDetailCard';
import ReviewList from './ReviewList';
import ReviewForm from './ReviewForm';

import { useAuth0 } from '@auth0/auth0-react';
import { useUserInfo } from '../UserInfoContext';
import { useFetchMovieReviews,transformReviewData } from '../hooks/useFetchReviews';
import { useUpdateReview } from '../hooks/useUpdateReview';
import { useDeleteReview } from '../hooks/useDeleteReview';

import { Box, Divider, Text } from '@chakra-ui/react';

function MovieDetailPage() {
	const { id } = useParams();
	const { isAuthenticated, loginWithRedirect } = useAuth0();
	const { userProfile } = useUserInfo();

	const [movie, setMovie] = useState(null); // State to hold the movie details and its reviews
	const [showReviewForm, setShowReviewForm] = useState(false);

	// Fetch reviews from the CineFav API
	const { fetchReviews, isLoading, reviews, setReviews, error } =
		useFetchMovieReviews();

	useEffect(() => {
		fetchReviews(id);
	}, [fetchReviews, id]);

	// for adding review
	const handleAddReview = () => {
		if (!isAuthenticated) {
			localStorage.setItem('lastPage', window.location.pathname);
			loginWithRedirect();
			return;
		}
		setShowReviewForm(!showReviewForm);
	};

	// for editing review

	const handleSuccessUpdateReview = () => {
		fetchReviews(id);
	};
	// for deleting review
	const deleteReview = useDeleteReview();
	const handleDeleteReview = (reviewId) => {
		deleteReview(reviewId, () => {
			// Update the local state to remove the deleted review
			setReviews(reviews.filter((review) => review.id !== reviewId));
		});
	};

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
					reviews: reviewsData.results.map((review) => ({
						...review,
						author_details: {
							...review.author_details,
							avatar_path: review.author_details.avatar_path
								? `https://image.tmdb.org/t/p/original${review.author_details.avatar_path}`
								: null,
						},
					})),
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
			<Divider my={5} />
			{/*Button's to publish new review */}
			<Button colorScheme='blue' onClick={handleAddReview} m='5px'>
				{showReviewForm ? 'Fold Review Form' : 'Publish My Review'}
			</Button>
			{/* <Text my={4} fontSize='sm' color='gray.500'>
				{JSON.stringify(reviews)}
			</Text> */}

			{/* Conditionally render the ReviewForm based on showReviewForm state */}
			{showReviewForm && (
				<ReviewForm
					movieId={movie.id}
					onClose={toggleReviewForm}
					onSuccess={() => fetchReviews(id)}
				/>
			)}

			{/* Divider */}
			<Divider my={5} />
			{/* Render the ReviewList component with the reviews from CineFav */}
			<ReviewList
				reviews={reviews}
				title={'Reviews from CineFav'}
				handleDelete={handleDeleteReview}
				handleEdit={handleSuccessUpdateReview}
				onSuccess={() => fetchReviews(id)}
			/>

			<Divider my={10} />
			<ReviewList reviews={movie.reviews} title={'Reviews from TMDB'} />
		</Box>
	);
}

export default MovieDetailPage;
