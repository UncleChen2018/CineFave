import React, { useState, useEffect } from 'react';
import { Box, Flex, SimpleGrid, Text } from '@chakra-ui/react';
import SearchBar from './SearchBar';
import MovieCard from './MovieCard'; // Replace with your actual MovieCard component
import { transformMovieData } from './Home';
import useToggleFavorite from '../hooks/useToggleFavorite';
import { useUserInfo } from '../UserInfoContext';



function SearchPage () {
	const [searchResults, setSearchResults] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

  const { favorites } = useUserInfo();
  const { toggleFavorite } = useToggleFavorite();

  const handleFavoriteClick = async (movie) => {
		await toggleFavorite(movie);
	};

	const handleSearch = async (query) => {
		if (!query) return;

		setIsLoading(true);
		setError(null);

		try {
			const baseUrl = process.env.REACT_APP_TMDB_BASE_URL;
			const apiKey = process.env.REACT_APP_TMDB_API_KEY;
			const url = `${baseUrl}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(
				query
			)}`;
			const response = await fetch(url);

			if (!response.ok) {
				throw new Error('Something went wrong with the search.');
			}
      function removeNoPosterMovies(movies) {
        return ;
      }
			const data = await response.json();
      const filteredMovies = data.results.filter((movie) => movie.poster_path !== null);
			setSearchResults(filteredMovies.map((movie) => transformMovieData(movie, favorites)));
		} catch (error) {
			setError(error.message);
		} finally {
			setIsLoading(false);
		}
	};

  useEffect(() => {
		// Update the isLiked property for moviesTD
		const updatedSearchResults = searchResults.map((movie) => ({
			...movie,
			isLiked: favorites.some((favorite) => favorite.movieId === movie.id),
		}));
		setSearchResults(updatedSearchResults);
	}, [favorites]); // This useEffect will run when favorites change


	return (
		<Box p={5}>
      <Text fontSize='xl' fontWeight='bold' mb={4}>
        {JSON.stringify(searchResults, null, 2)}
      </Text>
			<SearchBar onSearch={handleSearch} />
			{isLoading && <Text>Loading...</Text>}
			{error && <Text>Error: {error}</Text>}
			{!isLoading && !error && (
				<Flex wrap='wrap' justifyContent='center'>
					{searchResults.map((movie) => (
						<Box key={movie.id} m='2.5%'>
							{' '}
							{/* Set the margin to 2.5% on all sides to create a total space of 5% between items */}
							<MovieCard movie={movie} w={['120px', '150px']} onFavoriteClick={()=>handleFavoriteClick(movie)}/>
						</Box>
					))}
				</Flex>
			)}
		</Box>
	);
};

export default SearchPage;
