import React, { useState, useEffect } from 'react';
import { Box, Flex, SimpleGrid, Text } from '@chakra-ui/react';
import SearchBar from './SearchBar';
import MovieCard from './MovieCard'; // Replace with your actual MovieCard component
import { useSearchParams, useNavigate } from 'react-router-dom';
import { transformMovieData } from './Home';
import useToggleFavorite from '../hooks/useToggleFavorite';
import { useUserInfo } from '../UserInfoContext';

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get('query') || '';

	const [searchResults, setSearchResults] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);



	const { favorites } = useUserInfo();
	const { toggleFavorite } = useToggleFavorite();

	const handleFavoriteClick = async (movie) => {
		await toggleFavorite(movie);
	};




    // Fetch search results on initial load
    useEffect(() => {    
      if (searchTerm) {
        handleSearch(searchTerm);
      }
    }, [searchTerm]);
  
  
    const handleSearchChange = (newSearchTerm) => {
      // Update the search term in the URL
      if (newSearchTerm) {
        setSearchParams({ query: newSearchTerm });
      } else {
        setSearchParams({});
      }
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
			)}&include_adult=false&language=en-US&page=1`;
			const response = await fetch(url);
    

			if (!response.ok) {
				throw new Error('Something went wrong with the search.');
			}

			const data = await response.json();
			const filteredMovies = data.results.filter(
				(movie) => movie.poster_path !== null
			);
			setSearchResults(
				filteredMovies.map((movie) => transformMovieData(movie, favorites))
			);
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
			{/* <Text fontSize='xl' fontWeight='bold' mb={4}>
				{JSON.stringify(searchResults, null, 2)}
			</Text> */}
      {/* <Text fontSize='xl' fontWeight='bold' mb={4}>
        {searchParams.toString()}
      </Text> */}
			<SearchBar value={searchTerm} />
    
			{isLoading && <Text>Loading...</Text>}
			{error && <Text>Error: {error}</Text>}
      {!isLoading && !error && searchResults.length === 0 && searchTerm && (
        <Text>No results found for "{searchTerm}".</Text>
      )}
			{!isLoading && !error && (
				<Flex wrap='wrap' justifyContent='space-around'>
					{searchResults.map((movie) => (
						<Box key={movie.id} m='1.5%'>
							{' '}
							{/* Set the margin to 2.5% on all sides to create a total space of 5% between items */}
							<MovieCard
								movie={movie}
								w={['120px', '150px']}
								onFavoriteClick={() => handleFavoriteClick(movie)}
							/>
						</Box>
					))}
				</Flex>
			)}
		</Box>
	);
}

export default SearchPage;
