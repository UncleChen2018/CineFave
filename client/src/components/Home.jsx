import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import {
	Text,
	Box,
	Heading,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
} from '@chakra-ui/react';
import MovieCarousel from './MovieCarousel';
import { useUserInfo } from '../UserInfoContext';
import useToggleFavorite from '../hooks/useToggleFavorite';

export function transformMovieData(movie, favorites = []) {
	return {
		...movie,
		id: movie.id,
		title: movie.title,
		releaseDate: movie.release_date,
		rating: movie.vote_average,
		imageUrl: movie.poster_path?`${process.env.REACT_APP_TMDB_IMG_HOST_URL}${process.env.REACT_APP_TMDB_IMAGE_SIZE}${movie.poster_path}`:null,
		isLiked: favorites.some((fav) => fav.movieId === movie.id), // Check if the movie is in favorites
	};
}


export default function Home() {
	const { isAuthenticated, loginWithRedirect } = useAuth0();
	const { favorites } = useUserInfo();
	const [moviesTD, setMoviesTD] = useState([]);
	const [moviesTW, setMoviesTW] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const { toggleFavorite } = useToggleFavorite();

	// Fetch movies only once
	useEffect(() => {
		const fetchMovies = async (endpoint) => {
			try {
				const baseUrl = process.env.REACT_APP_TMDB_BASE_URL;
				const apiKey = process.env.REACT_APP_TMDB_API_KEY;
				const url = `${baseUrl}${endpoint}?api_key=${apiKey}`;
				const response = await fetch(url);
				if (!response.ok) {
					throw new Error('Something went wrong with the movie fetch.');
				}
				const data = await response.json();
				return data.results.map((movie) => (transformMovieData(movie,favorites)));
			} catch (error) {
				throw error;
			}
		};

		const loadMovies = async () => {
			setIsLoading(true);
			setError(null);
			try {
				let moviesTD = await fetchMovies(
					process.env.REACT_APP_TMDB_ENDPOINT_TRENDING_DAY
				);
				let moviesTW = await fetchMovies(
					process.env.REACT_APP_TMDB_ENDPOINT_RENDING_WEEK
				);

				setMoviesTD(moviesTD);
				setMoviesTW(moviesTW);
			} catch (error) {
				setError(error.message);
			} finally {
				setIsLoading(false);
			}
		};

		loadMovies();
	}, []); // Re-run the effect if authentication status or favorites change

	useEffect(() => {
		// Update the isLiked property for moviesTD
		const updatedMoviesTD = moviesTD.map((movie) => ({
			...movie,
			isLiked: favorites.some((favorite) => favorite.movieId === movie.id),
		}));
		setMoviesTD(updatedMoviesTD);

		// Update the isLiked property for moviesTW
		const updatedMoviesTW = moviesTW.map((movie) => ({
			...movie,
			isLiked: favorites.some((favorite) => favorite.movieId === movie.id),
		}));
		setMoviesTW(updatedMoviesTW);
	}, [favorites]); // This useEffect will run when favorites change

	if (isLoading) {
		return <Box>Loading...</Box>;
	}

	if (error) {
		return <Box>Error: {error}</Box>;
	}

	const handleFavoriteClick = async (movie) => {
		await toggleFavorite(movie);
	};

	const firstMovieTD = moviesTD[0] || {}; // Assuming you want to toggle favorite for the first movie in the list
	return (
		<Box p={{ base: 5, md: 20, lg: 30 }} mt={-5}>
			<Text fontSize='xl' mb={5}>
				{JSON.stringify(favorites)}
				{JSON.stringify(isAuthenticated)}
			</Text>
			<Text fontSize='xl' mb={5}>
				{JSON.stringify(moviesTD.map((movie) => movie.isLiked))}
			</Text>

			<button onClick={() => handleFavoriteClick(firstMovieTD)}>
				{firstMovieTD.isLiked ? 'Remove from Favorites' : 'Add to Favorites'}
			</button>
			<Box mb={4}>
				<Heading
					as='h2'
					size='lg'
					py='5'
					sx={{ fontSize: ['md', 'lg', 'xl', '2xl'] }}
				>
					Trending
				</Heading>
				<Tabs isFitted variant='enclosed'>
					<TabList mb='1em'>
						<Tab fontSize={['sm', 'md', 'lg', 'lg']} fontWeight='semibold'>
							Today
						</Tab>
						<Tab fontSize={['sm', 'md', 'lg', 'lg']} fontWeight='semibold'>
							This Week
						</Tab>
					</TabList>
					<TabPanels>
						<TabPanel>
							<MovieCarousel
								movies={moviesTD}
								w={['120px', '150px']}
								onFavoriteClick={handleFavoriteClick}
							/>
						</TabPanel>
						<TabPanel>
							<MovieCarousel
								movies={moviesTW}
								w={['120px', '150px']}
								onFavoriteClick={handleFavoriteClick}
							/>
						</TabPanel>
					</TabPanels>
				</Tabs>
			</Box>
		</Box>
	);
}
