import '../style/home.css';

import React, { useEffect, useState } from 'react';
import MovieCarousel from './MovieCarousel';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import {
	Box,
	Heading,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
} from '@chakra-ui/react';

export default function Home() {
	const navigate = useNavigate();
	const { isAuthenticated, loginWithRedirect } = useAuth0();
	const signUp = () => loginWithRedirect({ screen_hint: 'signup' });

	// fetch movies from the api
	const [moviesTD, setMoviesTD] = useState([]); // State to hold movie trending by day data
	const [moviesTW, setMoviesTW] = useState([]); // State to hold movie trending by week data
	const [isLoading, setIsLoading] = useState(false); // State to track loading status
	const [error, setError] = useState(null); // State to hold any errors

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
				return data.results.map((movie) => ({
          ...movie,
					id: movie.id,
					title: movie.title,
					releaseDate: movie.release_date,
					rating: movie.vote_average,
					imageUrl: `${process.env.REACT_APP_TMDB_IMG_HOST_URL}${process.env.REACT_APP_TMDB_IMAGE_SIZE}${movie.poster_path}`,
				}));
			} catch (error) {
				throw error;
			}
		};

		const loadMovies = async () => {
			setIsLoading(true);
			setError(null);

			try {
				const moviesTD = await fetchMovies(
					process.env.REACT_APP_TMDB_ENDPOINT_TRENDING_DAY
				);
				const moviesTW = await fetchMovies(
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

	}, []); // Only run on mount

	if (!moviesTD || !moviesTW ) {
		return <Box>Loading...</Box>; // Loading state or a spinner can be placed here
	}

	return (

		
		<Box p={{ base: 5, md: 20, lg: 30 }} mt={-5}>
			<Box mb={4}>
				<Heading
					as='h2'
					size='lg'
					py='5'
					sx={{
						fontSize: ['md', 'lg', 'xl', '2xl'],
					}}
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
							{/* Content for Today */}
							<MovieCarousel movies={moviesTD} w={['120px', '150px']} />
						</TabPanel>
						<TabPanel>
							{/* Content for This Week */}
							<MovieCarousel movies={moviesTW} w={['120px', '150px']} />
						</TabPanel>
					</TabPanels>
				</Tabs>
			</Box>
		</Box>
	);
}
